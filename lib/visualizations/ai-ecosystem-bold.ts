import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface AIPlayer {
  name: string
  type: 'public' | 'private'
  layers: string[] 
  valuation?: number 
  growth?: string
  description: string
  logo?: string
  ticker?: string
  isPlatform?: boolean
}

export class AIEcosystemBoldVisualization {
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
    // Clean gradient background for sophistication
    this.renderer.drawGradientBackground(
      ['#FFFFFF', '#F8FAFF'],
      'vertical'
    )
    
    // Draw BOLD header
    this.drawBoldHeader()
    
    // Core companies - FEWER but BIGGER
    const publicGiants: AIPlayer[] = [
      {
        name: 'NVIDIA',
        type: 'public',
        ticker: 'NVDA',
        layers: ['Infrastructure', 'Cloud', 'Applications'],
        description: '92% GPU monopoly',
        isPlatform: true
      },
      {
        name: 'Microsoft',
        type: 'public',
        ticker: 'MSFT',
        layers: ['Cloud', 'Models', 'Applications'],
        description: 'Azure + OpenAI',
        isPlatform: true
      },
      {
        name: 'Google',
        type: 'public',
        ticker: 'GOOGL',
        layers: ['Cloud', 'Models', 'Applications'],
        description: 'Gemini + Cloud',
        isPlatform: true
      },
      {
        name: 'Meta',
        type: 'public',
        ticker: 'META',
        layers: ['Models', 'Applications'],
        description: 'Llama + AI Labs',
        isPlatform: true
      },
      {
        name: 'Amazon',
        type: 'public',
        ticker: 'AMZN',
        layers: ['Cloud', 'Models'],
        description: 'AWS + Bedrock',
        isPlatform: true
      }
    ]

    const privateInnovators: AIPlayer[] = [
      {
        name: 'OpenAI',
        type: 'private',
        layers: ['Models', 'Applications'],
        valuation: 300,
        growth: 'Path to $1T',
        description: '$13B ARR',
        isPlatform: true
      },
      {
        name: 'Anthropic',
        type: 'private',
        layers: ['Models', 'Applications'],
        valuation: 170,
        growth: '1000% growth',
        description: '$5B ARR',
        isPlatform: true
      },
      {
        name: 'Databricks',
        type: 'private',
        layers: ['Cloud', 'Models'],
        valuation: 62,
        growth: '$2.4B ARR',
        description: 'Data + AI',
      },
      {
        name: 'Stripe',
        type: 'private',
        layers: ['Applications'],
        valuation: 65,
        growth: 'AI payments',
        description: 'Fintech AI',
      },
      {
        name: 'CoreWeave',
        type: 'private',
        layers: ['Cloud'],
        valuation: 19,
        growth: '10x YoY',
        description: 'GPU cloud',
      },
      {
        name: 'Scale AI',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 14,
        growth: '$600M ARR',
        description: 'Data labeling',
      },
      {
        name: 'Mistral',
        type: 'private',
        layers: ['Models'],
        valuation: 6,
        growth: '0→$150M/yr',
        description: 'EU champion',
      },
      {
        name: 'Hugging Face',
        type: 'private',
        layers: ['Models', 'Infrastructure'],
        valuation: 4.5,
        growth: '10M users',
        description: 'Model hub',
      }
    ]
    
    // Draw the main visualization with SPACE
    this.drawBoldEcosystem(publicGiants, privateInnovators)
    
    // Draw powerful insights
    this.drawPowerfulInsights()
    
    // Bold branding
    this.drawBoldBranding()
  }

  private drawBoldHeader() {
    const padding = 80
    
    // MASSIVE title
    this.renderer.drawText('AI: The Real Players', padding, 90, {
      fontSize: 72,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 800,
      color: brandConfig.colors.primary[900],
    })
    
    // Clear subtitle
    this.renderer.drawText('Public platforms provide infrastructure. Private companies drive innovation.', padding, 140, {
      fontSize: 28,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: brandConfig.colors.foreground.secondary,
    })
  }

  private drawBoldEcosystem(publicGiants: AIPlayer[], privateInnovators: AIPlayer[]) {
    const startY = 200
    const layerHeight = 180  // MUCH taller layers
    const layers = ['Applications', 'Models', 'Cloud', 'Infrastructure']
    const padding = 80
    const width = this.dimensions.width - padding * 2
    
    // Draw layer backgrounds - BIGGER
    layers.forEach((layer, index) => {
      const y = startY + index * layerHeight
      
      // Subtle gradient background
      const gradient = this.ctx.createLinearGradient(padding, y, padding + width, y)
      gradient.addColorStop(0, 'rgba(248, 250, 255, 0.5)')
      gradient.addColorStop(0.5, 'rgba(248, 250, 255, 0.8)')
      gradient.addColorStop(1, 'rgba(248, 250, 255, 0.5)')
      
      this.renderer.drawRoundedRect(padding, y, width, layerHeight - 10, 20, {
        fill: gradient,
        stroke: brandConfig.colors.neutral[200],
        strokeWidth: 1,
      })
      
      // BIG layer label
      this.renderer.drawText(layer.toUpperCase(), padding + 40, y + 45, {
        fontSize: 24,
        fontWeight: 700,
        color: brandConfig.colors.primary[600],
        letterSpacing: 2,
      })
    })
    
    // BOLD divider
    const dividerX = padding + width * 0.5
    
    // Gradient divider line
    const gradientLine = this.ctx.createLinearGradient(dividerX, startY, dividerX, startY + layers.length * layerHeight)
    gradientLine.addColorStop(0, brandUtils.hexToRgba(brandConfig.colors.primary[300], 0.2))
    gradientLine.addColorStop(0.5, brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.8))
    gradientLine.addColorStop(1, brandUtils.hexToRgba(brandConfig.colors.primary[300], 0.2))
    
    this.ctx.strokeStyle = gradientLine
    this.ctx.lineWidth = 3
    this.ctx.beginPath()
    this.ctx.moveTo(dividerX, startY)
    this.ctx.lineTo(dividerX, startY + layers.length * layerHeight - 20)
    this.ctx.stroke()
    
    // BIG section headers
    this.renderer.drawRoundedRect(padding + 150, startY - 55, 250, 45, 22, {
      fill: brandConfig.colors.primary[600],
    })
    this.renderer.drawText('PUBLIC GIANTS', padding + 275, startY - 28, {
      fontSize: 22,
      fontWeight: 700,
      color: '#FFFFFF',
      align: 'center',
      letterSpacing: 2,
    })
    
    this.renderer.drawRoundedRect(dividerX + 150, startY - 55, 250, 45, 22, {
      fill: brandConfig.colors.accent.neon,
    })
    this.renderer.drawText('PRIVATE INNOVATORS', dividerX + 275, startY - 28, {
      fontSize: 22,
      fontWeight: 700,
      color: '#FFFFFF',
      align: 'center',
      letterSpacing: 2,
    })
    
    // Draw public platforms - BIGGER boxes spanning layers
    publicGiants.forEach((platform, index) => {
      const x = padding + 120 + index * 160  // More spacing
      
      const layerIndices = platform.layers.map(l => layers.indexOf(l))
      const minLayer = Math.min(...layerIndices)
      const maxLayer = Math.max(...layerIndices)
      const spanY = startY + minLayer * layerHeight + 70
      const spanHeight = (maxLayer - minLayer + 1) * layerHeight - 80
      
      // Beautiful gradient box
      const boxGradient = this.ctx.createLinearGradient(x, spanY, x, spanY + spanHeight)
      boxGradient.addColorStop(0, brandUtils.hexToRgba(brandConfig.colors.primary[100], 0.3))
      boxGradient.addColorStop(1, brandUtils.hexToRgba(brandConfig.colors.primary[200], 0.5))
      
      this.renderer.drawRoundedRect(x, spanY, 140, spanHeight, 16, {
        fill: boxGradient,
        stroke: brandConfig.colors.primary[500],
        strokeWidth: 2,
        shadow: brandConfig.shadows.lg,
      })
      
      // BIG company name
      this.renderer.drawText(platform.name, x + 70, spanY + spanHeight/2 - 15, {
        fontSize: 24,
        fontWeight: 700,
        color: brandConfig.colors.primary[800],
        align: 'center',
      })
      
      // Ticker
      this.renderer.drawText(platform.ticker || '', x + 70, spanY + spanHeight/2 + 12, {
        fontSize: 16,
        color: brandConfig.colors.primary[600],
        align: 'center',
      })
      
      // Description
      this.renderer.drawText(platform.description, x + 70, spanY + spanHeight/2 + 35, {
        fontSize: 14,
        color: brandConfig.colors.neutral[600],
        align: 'center',
      })
    })
    
    // Draw private companies - BIGGER and BOLDER
    const privatesByLayer: { [key: string]: AIPlayer[] } = {}
    privateInnovators.forEach((company) => {
      const primaryLayer = company.layers[0]
      if (!privatesByLayer[primaryLayer]) {
        privatesByLayer[primaryLayer] = []
      }
      privatesByLayer[primaryLayer].push(company)
    })
    
    layers.forEach((layer, layerIndex) => {
      const companiesInLayer = privatesByLayer[layer] || []
      const y = startY + layerIndex * layerHeight
      
      companiesInLayer.forEach((company, index) => {
        const x = dividerX + 80 + index * 200  // Much more spacing
        this.drawBoldCompanyCard(company, x, y + 40, layerIndex)
      })
    })
  }

  private drawBoldCompanyCard(company: AIPlayer, x: number, y: number, layerIndex: number) {
    const width = 180
    const height = 120
    
    // Gradient background
    const gradient = this.ctx.createLinearGradient(x, y, x + width, y + height)
    gradient.addColorStop(0, brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.05))
    gradient.addColorStop(1, brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.15))
    
    // Card with shadow
    this.renderer.drawRoundedRect(x, y, width, height, 12, {
      fill: gradient,
      stroke: brandConfig.colors.accent.neon,
      strokeWidth: 2,
      shadow: {
        color: brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.3),
        blur: 15,
        offsetY: 5,
      },
    })
    
    // Company name - BIG
    this.renderer.drawText(company.name, x + width/2, y + 30, {
      fontSize: 26,
      fontWeight: 700,
      color: brandConfig.colors.primary[900],
      align: 'center',
    })
    
    // Valuation - PROMINENT
    if (company.valuation) {
      const valueText = company.valuation >= 100 
        ? `$${company.valuation}B`
        : `$${company.valuation.toFixed(1)}B`
      
      this.renderer.drawText(valueText, x + width/2, y + 60, {
        fontSize: 32,
        fontWeight: 800,
        color: brandConfig.colors.accent.neon,
        align: 'center',
      })
    }
    
    // Growth/Description
    if (company.growth) {
      this.renderer.drawText(company.growth, x + width/2, y + 85, {
        fontSize: 16,
        fontWeight: 500,
        color: brandConfig.colors.primary[700],
        align: 'center',
      })
    }
    
    // ARR/Description
    if (company.description) {
      this.renderer.drawText(company.description, x + width/2, y + 105, {
        fontSize: 14,
        color: brandConfig.colors.neutral[600],
        align: 'center',
        fontStyle: 'italic',
      })
    }
  }

  private drawPowerfulInsights() {
    const boxY = this.dimensions.height - 240
    const padding = 80
    
    // Powerful gradient background
    const gradient = this.ctx.createLinearGradient(padding, boxY, this.dimensions.width - padding, boxY + 180)
    gradient.addColorStop(0, brandUtils.hexToRgba(brandConfig.colors.primary[900], 0.95))
    gradient.addColorStop(1, brandUtils.hexToRgba(brandConfig.colors.primary[800], 0.95))
    
    this.renderer.drawRoundedRect(padding, boxY, this.dimensions.width - padding * 2, 180, 24, {
      fill: gradient,
      shadow: {
        color: 'rgba(0, 0, 0, 0.3)',
        blur: 30,
        offsetY: 10,
      },
    })
    
    // Title
    this.renderer.drawText('THE TRILLION DOLLAR QUESTION', padding + 50, boxY + 45, {
      fontSize: 32,
      fontWeight: 800,
      color: brandConfig.colors.accent.neon,
      letterSpacing: 2,
    })
    
    // Key stats in columns
    const stats = [
      { label: 'OpenAI', value: '$300B', sub: 'Path to $1T' },
      { label: 'Anthropic', value: '$170B', sub: '1000% growth' },
      { label: 'Combined', value: '$470B', sub: 'Half a trillion' },
      { label: 'Timeline', value: '3-10 years', sub: 'To surpass NVIDIA' },
    ]
    
    stats.forEach((stat, index) => {
      const statX = padding + 100 + index * 300
      
      this.renderer.drawText(stat.label, statX, boxY + 85, {
        fontSize: 18,
        color: brandConfig.colors.neutral[300],
      })
      
      this.renderer.drawText(stat.value, statX, boxY + 115, {
        fontSize: 36,
        fontWeight: 800,
        color: '#FFFFFF',
      })
      
      this.renderer.drawText(stat.sub, statX, boxY + 140, {
        fontSize: 14,
        color: brandConfig.colors.accent.neon,
        fontStyle: 'italic',
      })
    })
  }

  private drawBoldBranding() {
    // EQUIAM logo area
    this.renderer.drawText('EQUIAM', this.dimensions.width - 80, this.dimensions.height - 35, {
      fontSize: 24,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 800,
      color: brandConfig.colors.primary[600],
      align: 'right',
    })
    
    // Clean attribution
    this.renderer.drawText('Source: Company filings, PitchBook, August 2025', 80, this.dimensions.height - 35, {
      fontSize: 14,
      color: brandConfig.colors.neutral[400],
    })
  }
}