import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface AICompany {
  name: string
  value: number  // Market cap or valuation in billions
  logo?: string
  isPublic: boolean
}

export class AISimpleLogosVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private ctx: CanvasRenderingContext2D
  private loadedLogos: Map<string, HTMLImageElement> = new Map()
  private equiamLogo: HTMLImageElement | null = null

  constructor(
    renderer: CanvasRenderer,
    dimensions: { width: number; height: number }
  ) {
    this.renderer = renderer
    this.dimensions = dimensions
    this.ctx = (renderer as any).ctx
  }

  async render() {
    // Clean white background
    this.renderer.clear('#FFFFFF')
    
    // Load EQUIAM logo
    await this.loadEquiamLogo()
    
    // Draw header
    this.drawHeader()
    
    // Define companies - AI-focused only
    const publicCompanies: AICompany[] = [
      { name: 'NVIDIA', value: 4400, isPublic: true, logo: 'nvidia.png' },  // Updated: $4.4T confirmed
      { name: 'Microsoft', value: 3900, isPublic: true, logo: 'microsoft.png' },  // Updated: $3.9T
      { name: 'Apple', value: 3400, isPublic: true, logo: 'apple.png' },  // Updated: $3.4T  
      { name: 'Google', value: 2500, isPublic: true, logo: 'google.png' },  // Updated: $2.5T
      { name: 'Amazon', value: 2500, isPublic: true, logo: 'amazon.png' },  // $2.5T
      { name: 'Meta', value: 1900, isPublic: true, logo: 'meta.png' },  // $1.9T
      { name: 'Broadcom', value: 1400, isPublic: true, logo: 'broadcom.png' },  // $1.4T
      { name: 'Tesla', value: 1100, isPublic: true, logo: 'tesla.png' },  // $1.1T
      { name: 'Oracle', value: 650, isPublic: true, logo: 'oracle.png' },  // $650B
      { name: 'Palantir', value: 385, isPublic: true, logo: 'palantir.png' },  // $385B
      { name: 'AMD', value: 280, isPublic: true, logo: 'amd.png' },  // $280B
      { name: 'ServiceNow', value: 180, isPublic: true, logo: 'servicenow.png' },  // $180B
      { name: 'AppLovin', value: 150, isPublic: true, logo: 'applovin.png' },  // $150B
      { name: 'Snowflake', value: 65, isPublic: true, logo: 'snowflake.png' },  // $65B
      { name: 'CoreWeave', value: 45, isPublic: true, logo: 'coreweave.png' },  // $45B
      { name: 'Datadog', value: 45, isPublic: true, logo: 'datadog.png' },  // $45B
      { name: 'Astera Labs', value: 30, isPublic: true, logo: 'astera-labs.png' },  // $30B
      { name: 'Tempus', value: 14, isPublic: true, logo: 'tempus.png' },  // $14B
      { name: 'C3.ai', value: 2.3, isPublic: true, logo: 'c3ai.png' },  // $2.3B
    ]

    const privateCompanies: AICompany[] = [
      { name: 'OpenAI', value: 500, isPublic: false, logo: 'openai.png' },
      { name: 'Anthropic', value: 170, isPublic: false, logo: 'anthropic.png' },
      { name: 'Databricks', value: 100, isPublic: false, logo: 'databricks.png' },
      { name: 'SSI', value: 32, isPublic: false, logo: 'ssi.png' },  // Safe Superintelligence - Ilya Sutskever
      { name: 'Perplexity', value: 20, isPublic: false, logo: 'perplexity.png' },
      { name: 'Thinking Machines', value: 12, isPublic: false, logo: 'thinking-machines.png' },  // Mira Murati
      { name: 'Midjourney', value: 10, isPublic: false, logo: 'midjourney.png' },
      { name: 'Anysphere', value: 9.9, isPublic: false, logo: 'anysphere.png' },  // Cursor
      { name: 'Glean', value: 7.2, isPublic: false, logo: 'glean.png' },
      { name: 'Mistral', value: 6, isPublic: false, logo: 'mistral.png' },
      { name: 'Cohere', value: 5.5, isPublic: false, logo: 'cohere.png' },
      { name: 'SambaNova', value: 5.1, isPublic: false, logo: 'sambanova.png' },
      { name: 'Harvey', value: 5, isPublic: false, logo: 'harvey.png' },
      { name: 'Hugging Face', value: 4.5, isPublic: false, logo: 'hugging-face.png' },
      { name: 'Cerebras', value: 4.1, isPublic: false, logo: 'cerebras.png' },
      { name: 'OpenEvidence', value: 3.5, isPublic: false, logo: 'openevidence.png' },
      { name: 'ElevenLabs', value: 3.3, isPublic: false, logo: 'elevenlabs.png' },
      { name: 'Groq', value: 2.8, isPublic: false, logo: 'groq.png' },
      { name: 'Lovable', value: 1.8, isPublic: false, logo: 'lovable.png' },  // Vibe coding
      { name: 'Runway', value: 1.5, isPublic: false, logo: 'runway.png' },
    ]

    // Preload logos
    await this.preloadLogos([...publicCompanies, ...privateCompanies])
    
    // Draw the companies
    this.drawCompaniesGrid(publicCompanies, privateCompanies)
  }

  private drawHeader() {
    const padding = 80
    
    // Simple, clean title - MUCH BIGGER
    this.renderer.drawText('AI', padding, 100, {
      fontSize: 96,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 800,
      color: brandConfig.colors.primary[900],
    })
    
    // Subtitle - BIGGER
    this.renderer.drawText('Publicly traded firms vs. Private firms (August 2025)', padding, 160, {
      fontSize: 36,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: brandConfig.colors.foreground.secondary,
    })
    
    // Draw EQUIAM logo in top right
    if (this.equiamLogo && this.equiamLogo.complete) {
      const logoHeight = 60  // Larger than before (was 40)
      const aspectRatio = this.equiamLogo.width / this.equiamLogo.height
      const logoWidth = logoHeight * aspectRatio
      
      this.ctx.drawImage(
        this.equiamLogo,
        this.dimensions.width - padding - logoWidth,
        80,  // Align with title position
        logoWidth,
        logoHeight
      )
    }
  }

  private drawCompaniesGrid(publicCompanies: AICompany[], privateCompanies: AICompany[]) {
    const startY = 240  // Lowered by ~20px (0.1 inch) from 220
    const padding = 60  // Reduced padding to use more space
    const centerX = this.dimensions.width / 2
    
    // Calculate total market caps
    const publicTotal = publicCompanies.reduce((sum, company) => sum + company.value, 0)
    const privateTotal = privateCompanies.reduce((sum, company) => sum + company.value, 0)
    
    // Calculate available width for each side - EQUAL spacing from center
    const dividerMargin = 30  // Space on each side of divider
    const publicWidth = centerX - padding - dividerMargin
    const privateWidth = centerX - padding - dividerMargin  // Same width as public
    
    // Section headers - MUCH BIGGER for readability
    this.renderer.drawText('PUBLIC COMPANIES', centerX - publicWidth/2, startY, {
      fontSize: 36,  // Increased from 28
      fontWeight: 700,
      color: brandConfig.colors.neutral[800],  // Darker for better contrast
      align: 'center',
      letterSpacing: 2,
    })
    
    this.renderer.drawText('PRIVATE COMPANIES', centerX + publicWidth/2, startY, {
      fontSize: 36,  // Increased from 28
      fontWeight: 700,
      color: brandConfig.colors.primary[600],  // EQUIAM blue for private
      align: 'center',
      letterSpacing: 2,
    })
    
    // Simple clean divider
    this.ctx.strokeStyle = brandConfig.colors.neutral[200]
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(centerX, startY + 50)
    this.ctx.lineTo(centerX, this.dimensions.height - 140)
    this.ctx.stroke()
    
    // Use ALL available space for logos
    const availableHeight = this.dimensions.height - startY - 160  // Less footer space
    const headerOffset = 35  // Reduced space after headers - was 60
    
    // Keep companies in order as provided (already sorted by value)
    
    // PUBLIC SIDE - 5 columns to fit all 19 companies
    const publicCols = 5
    const publicRows = Math.ceil(publicCompanies.length / publicCols)
    
    // Calculate cell dimensions - bigger cells
    const publicCellWidth = publicWidth / publicCols
    const publicCellHeight = availableHeight / publicRows
    
    // Slightly smaller logos to fit more companies
    const publicLogoWidth = publicCellWidth * 0.68  // Reduced to fit 5 columns
    const publicLogoHeight = publicLogoWidth * 0.6  // Maintain aspect ratio
    
    // Ensure logos don't exceed cell height
    const maxPublicHeight = publicCellHeight * 0.7  // Leave room for value text
    const finalPublicHeight = Math.min(publicLogoHeight, maxPublicHeight)
    const finalPublicWidth = finalPublicHeight / 0.6
    
    publicCompanies.forEach((company, index) => {
      const row = Math.floor(index / publicCols)
      const col = index % publicCols
      
      // Center in cell
      const cellX = padding + col * publicCellWidth + publicCellWidth / 2
      const cellY = startY + headerOffset + row * publicCellHeight + publicCellHeight / 2
      
      // Position logo centered in cell
      const x = cellX - finalPublicWidth / 2
      const y = cellY - finalPublicHeight / 2 - 15  // Account for value text below
      
      this.drawCompanyItem(company, x, y, finalPublicWidth, finalPublicHeight, false)
    })
    
    // PRIVATE SIDE - 5 columns, symmetric spacing
    const privateCols = 5
    const privateRows = Math.ceil(privateCompanies.length / privateCols)
    
    // Calculate cell dimensions
    const privateCellWidth = privateWidth / privateCols  // Same total width as public
    const privateCellHeight = availableHeight / privateRows
    
    // Balanced logo size for private
    const privateLogoWidth = privateCellWidth * 0.68  // Match public side sizing
    const privateLogoHeight = privateLogoWidth * 0.6
    
    // Ensure logos don't exceed cell height
    const maxPrivateHeight = privateCellHeight * 0.7
    const finalPrivateHeight = Math.min(privateLogoHeight, maxPrivateHeight)
    const finalPrivateWidth = finalPrivateHeight / 0.6
    
    // Position private companies starting from center + margin
    const privateStartX = centerX + dividerMargin
    
    privateCompanies.forEach((company, index) => {
      const row = Math.floor(index / privateCols)
      const col = index % privateCols
      
      // Center in cell - symmetric with public side
      const cellX = privateStartX + col * privateCellWidth + privateCellWidth / 2
      const cellY = startY + headerOffset + row * privateCellHeight + privateCellHeight / 2
      
      // Position logo centered
      const x = cellX - finalPrivateWidth / 2
      const y = cellY - finalPrivateHeight / 2 - 15
      
      this.drawCompanyItem(company, x, y, finalPrivateWidth, finalPrivateHeight, true)
    })
    
    // Draw total market cap at bottom of each section
    const totalsY = this.dimensions.height - 60  // Lowered by another ~40px (0.2 inches total)
    
    // Format the totals
    const publicTotalText = publicTotal >= 1000 
      ? `Total Market Cap: $${(publicTotal/1000).toFixed(2)}T`
      : `Total Market Cap: $${publicTotal.toFixed(0)}B`
    
    const privateTotalText = privateTotal >= 1000 
      ? `Total Valuation: $${(privateTotal/1000).toFixed(2)}T`
      : `Total Valuation: $${privateTotal.toFixed(0)}B`
    
    // Format public side exactly as requested - line 1 with pipe separator
    const pureAIEstimate = publicTotal * 0.4  // Updated to 40% based on bottoms-up analysis
    const publicLine1 = `Total Market Cap: $${(publicTotal/1000).toFixed(2)}T | Pure AI Value: $${(pureAIEstimate/1000).toFixed(1)}T`
    
    this.renderer.drawText(publicLine1, padding + publicWidth/2, totalsY, {
      fontSize: 36,  // Increased from 32
      fontWeight: 800,
      color: brandConfig.colors.neutral[900],  // Darker black for more pop
      align: 'center',
    })
    
    // Calculate and draw line 2 - 2030 projection for AI value
    const yearsToProject = 5  // 2025 to 2030
    const publicAIProjected = pureAIEstimate * Math.pow(1.175, yearsToProject)  // 17.5% CAGR
    const publicLine2 = `2030 Projected AI Value: $${(publicAIProjected/1000).toFixed(1)}T`
    
    this.renderer.drawText(publicLine2, padding + publicWidth/2, totalsY + 35, {
      fontSize: 32,  // Increased from 28
      fontWeight: 700,  // Bolder for better readability
      color: brandConfig.colors.neutral[600],
      align: 'center',
    })
    
    // Draw private total - keep simple
    this.renderer.drawText(privateTotalText, centerX + privateWidth/2, totalsY, {
      fontSize: 36,  // Increased to match public side
      fontWeight: 800,
      color: brandConfig.colors.primary[600],  // Back to original EQUIAM blue
      align: 'center',
    })
    
    // Private projection
    const privateProjected = privateTotal * Math.pow(1.35, yearsToProject)  // 35% CAGR
    const privateProjectedText = privateProjected >= 1000 
      ? `2030 Projected: $${(privateProjected/1000).toFixed(1)}T`
      : `2030 Projected: $${privateProjected.toFixed(0)}B`
    
    // Draw private projection
    this.renderer.drawText(privateProjectedText, centerX + privateWidth/2, totalsY + 35, {
      fontSize: 32,  // Increased to match public side
      fontWeight: 700,  // Bolder for consistency
      color: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.9),  // Slightly more opaque
      align: 'center',
    })
  }

  private drawCompanyItem(company: AICompany, x: number, y: number, width: number, height: number, isPrivate: boolean) {
    // Check for logo
    const logo = this.loadedLogos.get(company.name.toLowerCase().replace(/\s/g, ''))
    
    if (logo && logo.complete) {
      // Draw logo FILLING the space
      const logoAspectRatio = logo.width / logo.height
      const boxAspectRatio = width / height
      
      let drawWidth, drawHeight
      
      // Fill the entire allocated space
      if (logoAspectRatio > boxAspectRatio) {
        // Logo is wider - fit to width
        drawWidth = width
        drawHeight = drawWidth / logoAspectRatio
      } else {
        // Logo is taller - fit to height  
        drawHeight = height
        drawWidth = drawHeight * logoAspectRatio
      }
      
      const offsetX = (width - drawWidth) / 2
      const offsetY = (height - drawHeight) / 2
      
      // Draw at full opacity for maximum visibility
      this.ctx.drawImage(logo, x + offsetX, y + offsetY, drawWidth, drawHeight)
    } else {
      // Simple placeholder
      this.renderer.drawRoundedRect(x, y, width, height, 12, {
        fill: isPrivate 
          ? brandUtils.hexToRgba(brandConfig.colors.primary[100], 0.3)
          : brandUtils.hexToRgba(brandConfig.colors.neutral[100], 0.3),
        stroke: isPrivate
          ? brandConfig.colors.primary[400]
          : brandConfig.colors.neutral[400],
        strokeWidth: 2,
      })
      
      // Company initial
      const initial = company.name.charAt(0)
      this.renderer.drawText(initial, x + width/2, y + height/2 + 10, {
        fontSize: height * 0.4,  // Scale with logo size
        fontWeight: 700,
        color: isPrivate 
          ? brandConfig.colors.primary[600]
          : brandConfig.colors.neutral[700],
        align: 'center',
      })
    }
    
    // Value text - MUCH BIGGER for readability
    const valueText = company.value >= 1000 
      ? `$${(company.value/1000).toFixed(1)}T`
      : company.value >= 100
      ? `$${Math.round(company.value)}B`
      : `$${company.value.toFixed(1)}B`
    
    this.renderer.drawText(valueText, x + width/2, y + height + 25, {
      fontSize: 32,  // Increased from 24 to 32 for better visibility
      fontWeight: 800,
      color: isPrivate 
        ? brandConfig.colors.primary[600] 
        : brandConfig.colors.neutral[700],
      align: 'center',
    })
  }


  private async preloadLogos(companies: AICompany[]): Promise<void> {
    const logoPromises: Promise<void>[] = []
    
    companies.forEach((company) => {
      if (company.logo) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            const key = company.name.toLowerCase().replace(/\s/g, '')
            this.loadedLogos.set(key, img)
            resolve()
          }
          img.onerror = () => resolve()
          img.src = `/company-logos/${company.logo}`
        })
        logoPromises.push(promise)
      }
    })
    
    await Promise.all(logoPromises)
  }

  private async loadEquiamLogo(): Promise<void> {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.equiamLogo = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load EQUIAM logo')
        resolve()
      }
      img.src = '/equiam_logos/EQUIAM_two_color_horizontal.png'
    })
  }
}