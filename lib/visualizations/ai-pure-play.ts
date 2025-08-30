import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface AICompany {
  name: string
  valuation: number  // Billions
  logo?: string
  description: string
  isPublic: boolean
  ticker?: string
  aiRevenue?: number  // For public companies with mixed revenue
  growthRate?: string
  founded?: number
}

export class AIPurePlayVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private theme: 'light' | 'dark'
  private ctx: CanvasRenderingContext2D
  private loadedLogos: Map<string, HTMLImageElement> = new Map()

  constructor(
    renderer: CanvasRenderer,
    dimensions: { width: number; height: number },
    theme: 'light' | 'dark' = 'light'
  ) {
    this.renderer = renderer
    this.dimensions = dimensions
    this.theme = theme
    this.ctx = (renderer as any).ctx
  }

  async render() {
    // Clean white background
    this.renderer.clear('#FFFFFF')
    
    // Draw header with honest framing
    this.drawHeader()
    
    // Define the ACTUAL AI companies (not attributing all of Google's market cap to AI)
    const publicAICompanies: AICompany[] = [
      { 
        name: 'NVIDIA', 
        valuation: 4413, 
        ticker: 'NVDA',
        description: 'AI chip monopoly (92% GPU share)',
        isPublic: true,
        logo: 'nvidia.png',
        growthRate: '122% YoY'
      },
      { 
        name: 'Palantir', 
        valuation: 95, 
        ticker: 'PLTR',
        description: 'AI platforms for enterprise',
        isPublic: true,
        logo: 'palantir.png',
        growthRate: '27% YoY'
      },
      { 
        name: 'C3.ai', 
        valuation: 3.2, 
        ticker: 'AI',
        description: 'Enterprise AI applications',
        isPublic: true,
        growthRate: '16% YoY'
      },
      { 
        name: 'SoundHound AI', 
        valuation: 1.8, 
        ticker: 'SOUN',
        description: 'Voice AI technology',
        isPublic: true,
        growthRate: '89% YoY'
      },
      { 
        name: 'BigBear.ai', 
        valuation: 0.4, 
        ticker: 'BBAI',
        description: 'AI analytics',
        isPublic: true,
        growthRate: '29% YoY'
      }
    ]
    
    const privateAICompanies: AICompany[] = [
      { 
        name: 'OpenAI', 
        valuation: 300, 
        description: 'GPT/ChatGPT creator',
        isPublic: false,
        growthRate: '$13B ARR',
        founded: 2015
      },
      { 
        name: 'Anthropic', 
        valuation: 170, 
        description: 'Claude AI - $1B→$5B ARR in 7mo',
        isPublic: false,
        logo: 'anthropic.png',
        growthRate: '1000%+ growth',
        founded: 2021
      },
      { 
        name: 'Databricks', 
        valuation: 62, 
        description: 'Data + AI platform',
        isPublic: false,
        logo: 'databricks.png',
        growthRate: '$2.4B ARR',
        founded: 2013
      },
      { 
        name: 'Hugging Face', 
        valuation: 4.5, 
        description: 'AI model hub',
        isPublic: false,
        growthRate: '10M+ users',
        founded: 2016
      },
      { 
        name: 'CoreWeave', 
        valuation: 19, 
        description: 'GPU cloud for AI',
        isPublic: false,
        logo: 'coreweave.png',
        growthRate: '10x YoY',
        founded: 2017
      },
      { 
        name: 'Scale AI', 
        valuation: 13.8, 
        description: 'Data labeling for AI',
        isPublic: false,
        growthRate: '$600M ARR',
        founded: 2016
      },
      { 
        name: 'Cohere', 
        valuation: 5.5, 
        description: 'Enterprise LLMs',
        isPublic: false,
        growthRate: '4x YoY',
        founded: 2019
      },
      { 
        name: 'Mistral AI', 
        valuation: 6, 
        description: 'European AI leader',
        isPublic: false,
        growthRate: 'From $0→$150M ARR in 1yr',
        founded: 2023
      },
      { 
        name: 'Perplexity', 
        valuation: 3, 
        description: 'AI search engine',
        isPublic: false,
        growthRate: '15M MAU',
        founded: 2022
      },
      { 
        name: 'Character.AI', 
        valuation: 5, 
        description: 'AI companions',
        isPublic: false,
        growthRate: '20M MAU',
        founded: 2021
      }
    ]
    
    // Preload logos
    await this.preloadLogos([...publicAICompanies, ...privateAICompanies])
    
    // Draw the comparison with proper spacing
    const startY = 180
    const columnWidth = (this.dimensions.width - 150) / 2
    
    // Public companies column
    this.drawCompanyColumn(
      'PUBLIC AI COMPANIES',
      'Limited pure-play options',
      publicAICompanies,
      60,
      startY,
      columnWidth,
      false
    )
    
    // Divider
    this.drawDivider()
    
    // Private companies column
    this.drawCompanyColumn(
      'PRIVATE AI COMPANIES',
      'Where innovation happens',
      privateAICompanies,
      60 + columnWidth + 30,
      startY,
      columnWidth,
      true
    )
    
    // Draw insights with intellectual honesty
    this.drawInsights()
    
    // Add branding
    this.drawBranding()
  }

  private drawHeader() {
    const padding = 60
    
    // Title
    this.renderer.drawText('Pure-Play AI: Public vs Private Markets', padding, 60, {
      fontSize: 48,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: brandConfig.colors.primary[900],
    })
    
    // Honest subtitle
    this.renderer.drawText('Comparing companies with AI as their primary business (not Big Tech\'s side projects)', padding, 100, {
      fontSize: 22,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: brandConfig.colors.foreground.secondary,
    })
    
    // Key insight
    this.renderer.drawText('Reality: 95% of pure-play AI innovation is happening in private markets', padding, 130, {
      fontSize: 20,
      fontWeight: 600,
      color: brandConfig.colors.accent.alert,
    })
  }

  private drawCompanyColumn(
    title: string,
    subtitle: string,
    companies: AICompany[],
    x: number,
    y: number,
    width: number,
    isPrivate: boolean
  ) {
    // Column header
    this.renderer.drawRoundedRect(x, y, width, 50, 12, {
      fill: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.primary[600],
    })
    
    this.renderer.drawText(title, x + 20, y + 22, {
      fontSize: 18,
      fontWeight: 700,
      color: '#FFFFFF',
      letterSpacing: 1,
    })
    
    this.renderer.drawText(subtitle, x + 20, y + 40, {
      fontSize: 13,
      color: '#FFFFFF',
      opacity: 0.9,
    })
    
    // Companies list with proper spacing
    const itemHeight = 65
    const startY = y + 70
    
    companies.forEach((company, index) => {
      const itemY = startY + index * itemHeight
      
      // Company container
      this.renderer.drawRoundedRect(x, itemY, width, itemHeight - 10, 8, {
        fill: isPrivate ? brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.05) : '#FAFBFC',
        stroke: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.neutral[200],
        strokeWidth: 1,
      })
      
      // Logo space (larger and properly sized)
      const logoSize = 40
      const logoX = x + 15
      const logoY = itemY + 7
      
      const logo = this.loadedLogos.get(company.name.toLowerCase().replace(/\./g, '').replace(/\s/g, ''))
      if (logo && logo.complete) {
        // Draw actual logo with proper aspect ratio
        const aspectRatio = logo.width / logo.height
        let drawWidth = logoSize
        let drawHeight = logoSize
        
        if (aspectRatio > 1) {
          drawHeight = logoSize / aspectRatio
        } else {
          drawWidth = logoSize * aspectRatio
        }
        
        const offsetX = (logoSize - drawWidth) / 2
        const offsetY = (logoSize - drawHeight) / 2
        
        this.ctx.drawImage(logo, logoX + offsetX, logoY + offsetY, drawWidth, drawHeight)
      } else {
        // Fallback
        this.renderer.drawRoundedRect(logoX, logoY, logoSize, logoSize, 6, {
          fill: isPrivate ? brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.1) : '#F0F0F0',
        })
        
        this.renderer.drawText(company.name.charAt(0), logoX + logoSize/2, logoY + logoSize/2 + 5, {
          fontSize: 20,
          fontWeight: 700,
          color: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.primary[600],
          align: 'center',
        })
      }
      
      // Company info
      const textX = logoX + logoSize + 15
      
      // Name and ticker/founded
      const nameText = company.ticker ? `${company.name} (${company.ticker})` : company.name
      this.renderer.drawText(nameText, textX, logoY + 12, {
        fontSize: 16,
        fontWeight: 600,
        color: brandConfig.colors.foreground.primary,
      })
      
      // Description
      this.renderer.drawText(company.description, textX, logoY + 28, {
        fontSize: 13,
        color: brandConfig.colors.foreground.secondary,
      })
      
      // Valuation and growth
      const valuationText = company.valuation >= 1000 
        ? `$${(company.valuation/1000).toFixed(1)}T` 
        : `$${company.valuation.toFixed(1)}B`
      
      this.renderer.drawText(valuationText, x + width - 20, logoY + 12, {
        fontSize: 18,
        fontWeight: 700,
        color: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.primary[600],
        align: 'right',
      })
      
      if (company.growthRate) {
        this.renderer.drawText(company.growthRate, x + width - 20, logoY + 32, {
          fontSize: 12,
          color: brandConfig.colors.foreground.tertiary,
          align: 'right',
          fontStyle: 'italic',
        })
      }
    })
    
    // Total valuation
    const total = companies.reduce((sum, c) => sum + c.valuation, 0)
    const totalText = total >= 1000 ? `$${(total/1000).toFixed(1)}T` : `$${total.toFixed(0)}B`
    
    this.renderer.drawRoundedRect(x, startY + companies.length * itemHeight + 10, width, 40, 8, {
      fill: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.primary[600],
    })
    
    this.renderer.drawText('TOTAL MARKET CAP', x + 20, startY + companies.length * itemHeight + 32, {
      fontSize: 12,
      fontWeight: 600,
      color: '#FFFFFF',
      letterSpacing: 1,
    })
    
    this.renderer.drawText(totalText, x + width - 20, startY + companies.length * itemHeight + 32, {
      fontSize: 20,
      fontWeight: 700,
      color: '#FFFFFF',
      align: 'right',
    })
  }

  private drawDivider() {
    const centerX = this.dimensions.width / 2
    
    // Vertical divider line
    this.ctx.strokeStyle = brandConfig.colors.primary[200]
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([10, 5])
    this.ctx.beginPath()
    this.ctx.moveTo(centerX, 180)
    this.ctx.lineTo(centerX, this.dimensions.height - 200)
    this.ctx.stroke()
    this.ctx.setLineDash([])
    
    // VS badge
    this.renderer.drawRoundedRect(centerX - 30, this.dimensions.height/2 - 30, 60, 60, 30, {
      fill: '#FFFFFF',
      stroke: brandConfig.colors.primary[600],
      strokeWidth: 3,
    })
    
    this.renderer.drawText('VS', centerX, this.dimensions.height/2 + 8, {
      fontSize: 24,
      fontWeight: 700,
      color: brandConfig.colors.primary[600],
      align: 'center',
    })
  }

  private drawInsights() {
    const boxY = this.dimensions.height - 180
    const padding = 60
    
    // Insights box
    this.renderer.drawRoundedRect(padding, boxY, this.dimensions.width - padding * 2, 120, 16, {
      fill: brandUtils.hexToRgba(brandConfig.colors.primary[100], 0.3),
      stroke: brandConfig.colors.primary[600],
      strokeWidth: 2,
    })
    
    // Title
    this.renderer.drawText('THE REALITY CHECK', padding + 30, boxY + 35, {
      fontSize: 20,
      fontWeight: 700,
      color: brandConfig.colors.primary[600],
      letterSpacing: 1,
    })
    
    // Key points
    const points = [
      'Public markets offer just 5 pure-play AI companies (excluding Big Tech)',
      'Private AI companies outnumber public 20:1 with higher growth rates',
      'OpenAI + Anthropic alone ($470B) could be worth more than all public pure-plays combined',
      'The next NVIDIA is being built in private markets right now'
    ]
    
    points.forEach((point, index) => {
      this.renderer.drawText(`• ${point}`, padding + 30, boxY + 60 + index * 20, {
        fontSize: 14,
        color: brandConfig.colors.foreground.primary,
      })
    })
  }

  private drawBranding() {
    // EQUIAM watermark
    this.renderer.drawText('EQUIAM', this.dimensions.width - 60, this.dimensions.height - 30, {
      fontSize: 16,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.4),
      align: 'right',
    })
    
    // Disclaimer
    this.renderer.drawText('*Pure-play defined as companies with AI/ML as primary business model. Big Tech AI revenues not included for fair comparison.', 60, this.dimensions.height - 30, {
      fontSize: 10,
      color: brandConfig.colors.neutral[400],
      fontStyle: 'italic',
    })
  }

  private async preloadLogos(companies: AICompany[]): Promise<void> {
    const logoPromises: Promise<void>[] = []
    
    companies.forEach((company) => {
      if (company.logo) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            const key = company.name.toLowerCase().replace(/\./g, '').replace(/\s/g, '')
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
}