import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface SpaceCompany {
  name: string
  value: number  // Market cap or valuation in billions
  logo?: string
  isPublic: boolean
}

export class SpaceTechMapVisualization {
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
    
    // Define companies - Space/Defense focused
    const publicCompanies: SpaceCompany[] = [
      // Ordered by market cap (highest to lowest) - Updated Aug 26, 2025
      { name: 'RTX', value: 213, isPublic: true, logo: 'rtx.png' },  // $213B total, ~15% space
      { name: 'Boeing', value: 177, isPublic: true, logo: 'boeing.png' },  // $177B total, ~20% space
      { name: 'Airbus', value: 165, isPublic: true, logo: 'airbus.png' },  // €142.5B * 1.16 = $165B, ~7% space
      { name: 'Lockheed Martin', value: 106, isPublic: true, logo: 'lockheed-martin.png' },  // $106B, ~35% space
      { name: 'General Dynamics', value: 86, isPublic: true, logo: 'general-dynamics.png' },  // $86B, ~5% space
      { name: 'Northrop Grumman', value: 84, isPublic: true, logo: 'northrop-grumman.png' },  // $84B, ~25% space
      { name: 'Thales', value: 56, isPublic: true, logo: 'thales.png' },  // ~15% space
      { name: 'L3Harris', value: 52, isPublic: true, logo: 'l3harris.png' },  // ~20% space
      { name: 'Rocket Lab', value: 23, isPublic: true, logo: 'rocket-lab.png' },  // 100% space
      { name: 'AST SpaceMobile', value: 16, isPublic: true, logo: 'ast-spacemobile.png' },  // $16B, 100% space
      { name: 'EchoStar', value: 8.6, isPublic: true, logo: 'echostar.png' },  // $8.6B, 100% space
      { name: 'Firefly', value: 6.6, isPublic: true, logo: 'firefly.png' },  // $6.6B, 100% space
      { name: 'Viasat', value: 3.8, isPublic: true, logo: 'viasat.png' },  // $3.8B, 100% space
      { name: 'Iridium', value: 2.6, isPublic: true, logo: 'iridium.png' },  // $2.6B, 100% space
      { name: 'Planet Labs', value: 2.1, isPublic: true, logo: 'planet-labs.png' },  // $2.1B, 100% space
      { name: 'Intuitive Machines', value: 1.6, isPublic: true, logo: 'intuitive-machines.png' },  // 100% space
      { name: 'Redwire', value: 1.3, isPublic: true, logo: 'redwire.png' },  // 100% space
      { name: 'Astroscale', value: 0.62, isPublic: true, logo: 'astroscale.png' },  // 100% space
      { name: 'Virgin Galactic', value: 0.18, isPublic: true, logo: 'virgin-galactic.png' },  // 100% space
    ]

    const privateCompanies: SpaceCompany[] = [
      // Ordered by valuation (highest to lowest) - REMOVED Anduril & Shield AI (defense only)
      { name: 'SpaceX', value: 400, isPublic: false, logo: 'spacex.png' },  // $400B as of July 2025
      { name: 'Blue Origin', value: 75, isPublic: false, logo: 'blue-origin.png' },  // Estimated $50-100B
      { name: 'Sierra Space', value: 5.3, isPublic: false, logo: 'sierra-space.png' },
      { name: 'Relativity Space', value: 4.2, isPublic: false, logo: 'relativity-space.png' },  // 3D printed rockets
      { name: 'ABL Space', value: 2.4, isPublic: false, logo: 'abl-space.png' },
      { name: 'Axiom Space', value: 2.2, isPublic: false, logo: 'axiom-space.png' },  // Space stations
      { name: 'Astranis', value: 1.6, isPublic: false, logo: 'astranis.png' },  // Small GEO satellites
      { name: 'Impulse Space', value: 1.0, isPublic: false, logo: 'impulse-space.png' },  // Space tugs
      { name: 'Loft Orbital', value: 0.6, isPublic: false, logo: 'loft-orbital.png' },  // Space infrastructure as a service
      { name: 'Varda Space', value: 0.5, isPublic: false, logo: 'varda-space.png' },  // Space manufacturing
      { name: 'Stoke Space', value: 0.4, isPublic: false, logo: 'stoke-space.png' },  // Fully reusable rockets
      { name: 'Astrobotic', value: 0.3, isPublic: false, logo: 'astrobotic.png' },  // Lunar landers
      { name: 'Orbex', value: 0.2, isPublic: false, logo: 'orbex.png' },  // UK launch
    ]

    // Preload logos
    await this.preloadLogos([...publicCompanies, ...privateCompanies])
    
    // Draw the companies
    this.drawCompaniesGrid(publicCompanies, privateCompanies)
  }

  private drawHeader() {
    const padding = 60
    
    // Main title - MUCH BIGGER
    this.renderer.drawText('SPACE TECH', padding, 100, {
      fontSize: 96,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 800,
      color: brandConfig.colors.primary[900],
    })
    
    // Subtitle - with date
    this.renderer.drawText('Publicly traded firms vs. Private firms (August 2025)', padding, 160, {
      fontSize: 36,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: brandConfig.colors.foreground.secondary,
    })
    
    // Draw EQUIAM logo in top right
    if (this.equiamLogo && this.equiamLogo.complete) {
      const logoHeight = 60
      const aspectRatio = this.equiamLogo.width / this.equiamLogo.height
      const logoWidth = logoHeight * aspectRatio
      
      this.ctx.drawImage(
        this.equiamLogo,
        this.dimensions.width - padding - logoWidth,
        80,
        logoWidth,
        logoHeight
      )
    }
  }

  private drawCompaniesGrid(publicCompanies: SpaceCompany[], privateCompanies: SpaceCompany[]) {
    const startY = 240  // Lowered header position
    const padding = 60
    const centerX = this.dimensions.width / 2
    
    // Calculate total market caps
    const publicTotal = publicCompanies.reduce((sum, company) => sum + company.value, 0)
    const privateTotal = privateCompanies.reduce((sum, company) => sum + company.value, 0)
    
    // Calculate available width for each side - EQUAL spacing
    const dividerMargin = 30
    const publicWidth = centerX - padding - dividerMargin
    const privateWidth = centerX - padding - dividerMargin
    
    // Section headers - BIG and readable
    this.renderer.drawText('PUBLIC COMPANIES', centerX - publicWidth/2, startY, {
      fontSize: 36,
      fontWeight: 700,
      color: brandConfig.colors.neutral[800],
      align: 'center',
      letterSpacing: 2,
    })
    
    this.renderer.drawText('PRIVATE COMPANIES', centerX + publicWidth/2, startY, {
      fontSize: 36,
      fontWeight: 700,
      color: brandConfig.colors.primary[600],
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
    const availableHeight = this.dimensions.height - startY - 160
    const headerOffset = 35
    
    // PUBLIC SIDE - 4 columns to fit 14 companies
    const publicCols = 4
    const publicRows = Math.ceil(publicCompanies.length / publicCols)
    
    // Calculate cell dimensions
    const publicCellWidth = publicWidth / publicCols
    const publicCellHeight = availableHeight / publicRows
    
    // Logo sizing
    const publicLogoWidth = publicCellWidth * 0.68
    const publicLogoHeight = publicLogoWidth * 0.6
    
    // Ensure logos don't exceed cell height
    const maxPublicHeight = publicCellHeight * 0.65
    const finalPublicHeight = Math.min(publicLogoHeight, maxPublicHeight)
    const finalPublicWidth = finalPublicHeight / 0.6
    
    publicCompanies.forEach((company, index) => {
      const row = Math.floor(index / publicCols)
      const col = index % publicCols
      
      // Center in cell
      const cellX = padding + col * publicCellWidth + publicCellWidth / 2
      const cellY = startY + headerOffset + row * publicCellHeight + publicCellHeight / 2
      
      const x = cellX - finalPublicWidth / 2
      const y = cellY - finalPublicHeight / 2 - 15
      
      this.drawCompanyItem(company, x, y, finalPublicWidth, finalPublicHeight, false)
    })
    
    // PRIVATE SIDE - 4 columns for 15 companies
    const privateCols = 4
    const privateRows = Math.ceil(privateCompanies.length / privateCols)
    
    // Calculate cell dimensions
    const privateCellWidth = privateWidth / privateCols
    const privateCellHeight = availableHeight / privateRows
    
    // Logo sizing
    const privateLogoWidth = privateCellWidth * 0.68
    const privateLogoHeight = privateLogoWidth * 0.6
    
    // Ensure logos don't exceed cell height
    const maxPrivateHeight = privateCellHeight * 0.65
    const finalPrivateHeight = Math.min(privateLogoHeight, maxPrivateHeight)
    const finalPrivateWidth = finalPrivateHeight / 0.6
    
    // Position private companies
    const privateStartX = centerX + dividerMargin
    
    privateCompanies.forEach((company, index) => {
      const row = Math.floor(index / privateCols)
      const col = index % privateCols
      
      const cellX = privateStartX + col * privateCellWidth + privateCellWidth / 2
      const cellY = startY + headerOffset + row * privateCellHeight + privateCellHeight / 2
      
      const x = cellX - finalPrivateWidth / 2
      const y = cellY - finalPrivateHeight / 2 - 15
      
      this.drawCompanyItem(company, x, y, finalPrivateWidth, finalPrivateHeight, true)
    })
    
    // Draw total market cap at bottom of each section
    const totalsY = this.dimensions.height - 60
    
    // Format the totals - Always in Billions for consistency
    const publicTotalText = `Total Market Cap: $${publicTotal.toFixed(0)}B`
    
    const privateTotalText = `Total Valuation: $${privateTotal.toFixed(0)}B`
    
    // PRECISE space exposure calculation based on bottoms-up analysis:
    // RTX: $32B, Boeing: $35B, Airbus: $12B, LMT: $37B, GD: $4B, NGC: $21B, Thales: $8B, L3H: $10B
    // Pure-play companies (100% space): All others
    const pureSpaceEstimate = 32 + 35 + 12 + 37 + 4 + 21 + 8 + 10 + // Defense contractors space portions
                             23 + 16 + 8.6 + 6.6 + 3.8 + 2.6 + 2.1 + 1.6 + 1.3 + 0.62 + 0.18 // Pure plays
    const publicLine1 = `Total Market Cap: $${publicTotal.toFixed(0)}B | Pure Space Value: $${pureSpaceEstimate.toFixed(0)}B`
    
    this.renderer.drawText(publicLine1, padding + publicWidth/2, totalsY, {
      fontSize: 36,
      fontWeight: 800,
      color: brandConfig.colors.neutral[900],
      align: 'center',
    })
    
    // 2030 projections - Space market growing at 25% CAGR for pure space
    const yearsToProject = 5
    const publicSpaceProjected = pureSpaceEstimate * Math.pow(1.25, yearsToProject)
    const publicLine2 = publicSpaceProjected >= 1000
      ? `2030 Projected Space Value: $${(publicSpaceProjected/1000).toFixed(1)}T`
      : `2030 Projected Space Value: $${publicSpaceProjected.toFixed(0)}B`
    
    this.renderer.drawText(publicLine2, padding + publicWidth/2, totalsY + 35, {
      fontSize: 32,
      fontWeight: 700,
      color: brandConfig.colors.neutral[600],
      align: 'center',
    })
    
    // Draw private total
    this.renderer.drawText(privateTotalText, centerX + privateWidth/2, totalsY, {
      fontSize: 36,
      fontWeight: 800,
      color: brandConfig.colors.primary[600],
      align: 'center',
    })
    
    // Private projection - 40% CAGR (faster growth)
    const privateProjected = privateTotal * Math.pow(1.40, yearsToProject)
    const privateProjectedText = privateProjected >= 1000 
      ? `2030 Projected: $${(privateProjected/1000).toFixed(1)}T`
      : `2030 Projected: $${privateProjected.toFixed(0)}B`
    
    this.renderer.drawText(privateProjectedText, centerX + privateWidth/2, totalsY + 35, {
      fontSize: 32,
      fontWeight: 700,
      color: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.9),
      align: 'center',
    })
  }

  private drawCompanyItem(company: SpaceCompany, x: number, y: number, width: number, height: number, isPrivate: boolean) {
    // Check for logo
    const logo = this.loadedLogos.get(company.name.toLowerCase().replace(/\s/g, ''))
    
    if (logo && logo.complete) {
      // Draw logo
      const logoAspectRatio = logo.width / logo.height
      const boxAspectRatio = width / height
      
      let drawWidth, drawHeight
      
      if (logoAspectRatio > boxAspectRatio) {
        drawWidth = width
        drawHeight = drawWidth / logoAspectRatio
      } else {
        drawHeight = height
        drawWidth = drawHeight * logoAspectRatio
      }
      
      const offsetX = (width - drawWidth) / 2
      const offsetY = (height - drawHeight) / 2
      
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
        fontSize: height * 0.4,
        fontWeight: 700,
        color: isPrivate 
          ? brandConfig.colors.primary[600]
          : brandConfig.colors.neutral[700],
        align: 'center',
      })
    }
    
    // Value text - BIGGER and clearer
    const valueText = company.value >= 1000 
      ? `$${(company.value/1000).toFixed(1)}T`
      : company.value >= 100
      ? `$${Math.round(company.value)}B`
      : company.value >= 1
      ? `$${company.value.toFixed(1)}B`
      : `$${(company.value * 1000).toFixed(0)}M`  // For sub-billion valuations
    
    this.renderer.drawText(valueText, x + width/2, y + height + 25, {
      fontSize: 24,
      fontWeight: 800,
      color: isPrivate 
        ? brandConfig.colors.primary[600] 
        : brandConfig.colors.neutral[700],
      align: 'center',
    })
  }

  private async preloadLogos(companies: SpaceCompany[]): Promise<void> {
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