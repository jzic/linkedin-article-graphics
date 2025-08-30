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

export class AIEcosystemCleanVisualization {
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
    
    // Draw header
    this.drawHeader()
    
    // Public giants - ALL have chip projects now
    const publicGiants: AIPlayer[] = [
      {
        name: 'NVIDIA',
        type: 'public',
        ticker: 'NVDA',
        layers: ['Infrastructure', 'Cloud', 'Models', 'Applications'],
        description: 'GPUs + CUDA',
        isPlatform: true
      },
      {
        name: 'Google',
        type: 'public',
        ticker: 'GOOGL',
        layers: ['Infrastructure', 'Cloud', 'Models', 'Applications'],
        description: 'TPUs + Gemini',
        isPlatform: true
      },
      {
        name: 'Microsoft',
        type: 'public',
        ticker: 'MSFT',
        layers: ['Infrastructure', 'Cloud', 'Models', 'Applications'],
        description: 'Maia chips + Azure',
        isPlatform: true
      },
      {
        name: 'Amazon',
        type: 'public',
        ticker: 'AMZN',
        layers: ['Infrastructure', 'Cloud', 'Models', 'Applications'],
        description: 'Trainium + AWS',
        isPlatform: true
      },
      {
        name: 'Meta',
        type: 'public',
        ticker: 'META',
        layers: ['Infrastructure', 'Models', 'Applications'],
        description: 'MTIA chips + Llama',
        isPlatform: true
      },
      {
        name: 'Apple',
        type: 'public',
        ticker: 'AAPL',
        layers: ['Infrastructure', 'Models', 'Applications'],
        description: 'M-series + AI',
        isPlatform: true
      }
    ]

    // More comprehensive private coverage
    const privateInnovators: AIPlayer[] = [
      // Models Layer
      {
        name: 'OpenAI',
        type: 'private',
        layers: ['Models', 'Applications'],
        valuation: 300,
        growth: '$13B ARR',
        description: 'GPT-4, ChatGPT',
        isPlatform: true
      },
      {
        name: 'Anthropic',
        type: 'private',
        layers: ['Models', 'Applications'],
        valuation: 170,
        growth: '1000% YoY',
        description: 'Claude AI',
        isPlatform: true
      },
      {
        name: 'Mistral',
        type: 'private',
        layers: ['Models'],
        valuation: 6,
        growth: '0→$150M/yr',
        description: 'Open models',
      },
      {
        name: 'Cohere',
        type: 'private',
        layers: ['Models'],
        valuation: 5.5,
        growth: '4x YoY',
        description: 'Enterprise LLMs',
      },
      {
        name: 'Inflection',
        type: 'private',
        layers: ['Models'],
        valuation: 4,
        growth: 'Pi assistant',
        description: 'Personal AI',
      },
      
      // Cloud Layer
      {
        name: 'CoreWeave',
        type: 'private',
        layers: ['Cloud'],
        valuation: 19,
        growth: '10x YoY',
        description: 'GPU cloud',
      },
      {
        name: 'Lambda Labs',
        type: 'private',
        layers: ['Cloud'],
        valuation: 1.5,
        growth: '5x YoY',
        description: 'AI compute',
      },
      {
        name: 'Together AI',
        type: 'private',
        layers: ['Cloud'],
        valuation: 1.3,
        growth: 'Distributed',
        description: 'Open compute',
      },
      
      // Infrastructure Layer
      {
        name: 'Databricks',
        type: 'private',
        layers: ['Infrastructure', 'Cloud'],
        valuation: 62,
        growth: '$2.4B ARR',
        description: 'Data + AI',
      },
      {
        name: 'Cerebras',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 4.1,
        growth: 'WSE-3',
        description: 'Wafer chips',
      },
      {
        name: 'Groq',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 2.8,
        growth: 'LPU speed',
        description: 'Inference chips',
      },
      {
        name: 'SambaNova',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 5.1,
        growth: 'Dataflow',
        description: 'AI systems',
      },
      {
        name: 'Graphcore',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 2.8,
        growth: 'IPUs',
        description: 'AI processors',
      },
      
      // Applications Layer
      {
        name: 'Perplexity',
        type: 'private',
        layers: ['Applications'],
        valuation: 3,
        growth: '15M MAU',
        description: 'AI search',
      },
      {
        name: 'Character.AI',
        type: 'private',
        layers: ['Applications'],
        valuation: 5,
        growth: '20M MAU',
        description: 'AI companions',
      },
      {
        name: 'Midjourney',
        type: 'private',
        layers: ['Applications'],
        valuation: 10,
        growth: '20M users',
        description: 'Image gen',
      },
      {
        name: 'Runway',
        type: 'private',
        layers: ['Applications'],
        valuation: 1.5,
        growth: 'Gen-3',
        description: 'Video AI',
      },
      {
        name: 'Jasper',
        type: 'private',
        layers: ['Applications'],
        valuation: 1.5,
        growth: '100K users',
        description: 'AI writing',
      },
      {
        name: 'Glean',
        type: 'private',
        layers: ['Applications'],
        valuation: 2.2,
        growth: 'Enterprise',
        description: 'Work search',
      },
      
      // Multi-layer
      {
        name: 'Hugging Face',
        type: 'private',
        layers: ['Models', 'Infrastructure'],
        valuation: 4.5,
        growth: '10M users',
        description: 'Model hub',
      },
      {
        name: 'Scale AI',
        type: 'private',
        layers: ['Infrastructure', 'Applications'],
        valuation: 13.8,
        growth: '$600M ARR',
        description: 'Data labeling',
      }
    ]
    
    // Draw the ecosystem
    this.drawEcosystem(publicGiants, privateInnovators)
    
    // Simple footer
    this.drawFooter()
  }

  private drawHeader() {
    const padding = 80
    
    // Clean title
    this.renderer.drawText('The AI Ecosystem', padding, 80, {
      fontSize: 64,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 800,
      color: brandConfig.colors.primary[900],
    })
    
    // Subtitle
    this.renderer.drawText('Every tech giant now has chips. Private companies fill the innovation gaps.', padding, 125, {
      fontSize: 26,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: brandConfig.colors.foreground.secondary,
    })
  }

  private drawEcosystem(publicGiants: AIPlayer[], privateInnovators: AIPlayer[]) {
    const startY = 180
    const layerHeight = 160
    const layers = ['Applications', 'Models', 'Cloud', 'Infrastructure']
    const padding = 80
    const width = this.dimensions.width - padding * 2
    
    // Draw layer backgrounds
    layers.forEach((layer, index) => {
      const y = startY + index * layerHeight
      
      // Layer background
      this.renderer.drawRoundedRect(padding, y, width, layerHeight - 8, 16, {
        fill: 'rgba(248, 250, 255, 0.6)',
        stroke: brandConfig.colors.neutral[200],
        strokeWidth: 1,
      })
      
      // Layer label - positioned to not be covered
      this.renderer.drawRoundedRect(padding + 20, y + 15, 140, 35, 8, {
        fill: brandConfig.colors.primary[600],
      })
      
      this.renderer.drawText(layer.toUpperCase(), padding + 90, y + 38, {
        fontSize: 18,
        fontWeight: 700,
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 1,
      })
    })
    
    // Center divider
    const dividerX = padding + width * 0.48
    
    this.ctx.strokeStyle = brandConfig.colors.primary[300]
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([8, 4])
    this.ctx.beginPath()
    this.ctx.moveTo(dividerX, startY)
    this.ctx.lineTo(dividerX, startY + layers.length * layerHeight - 20)
    this.ctx.stroke()
    this.ctx.setLineDash([])
    
    // Headers
    this.renderer.drawText('PUBLIC', padding + 300, startY - 20, {
      fontSize: 20,
      fontWeight: 700,
      color: brandConfig.colors.primary[600],
      letterSpacing: 2,
    })
    
    this.renderer.drawText('PRIVATE', dividerX + 250, startY - 20, {
      fontSize: 20,
      fontWeight: 700,
      color: brandConfig.colors.accent.neon,
      letterSpacing: 2,
    })
    
    // Draw public companies - starting right of the layer labels
    const publicStartX = padding + 200  // Move right to avoid covering labels
    publicGiants.forEach((platform, index) => {
      const x = publicStartX + index * 110  // Tighter spacing
      
      const layerIndices = platform.layers.map(l => layers.indexOf(l))
      const minLayer = Math.min(...layerIndices)
      const maxLayer = Math.max(...layerIndices)
      const spanY = startY + minLayer * layerHeight + 60
      const spanHeight = (maxLayer - minLayer + 1) * layerHeight - 70
      
      // Platform box
      this.renderer.drawRoundedRect(x, spanY, 100, spanHeight, 12, {
        fill: brandUtils.hexToRgba(brandConfig.colors.primary[100], 0.4),
        stroke: brandConfig.colors.primary[500],
        strokeWidth: 1.5,
      })
      
      // Company name
      this.renderer.drawText(platform.name, x + 50, spanY + spanHeight/2 - 12, {
        fontSize: 18,
        fontWeight: 700,
        color: brandConfig.colors.primary[800],
        align: 'center',
      })
      
      // Ticker
      this.renderer.drawText(platform.ticker || '', x + 50, spanY + spanHeight/2 + 8, {
        fontSize: 13,
        color: brandConfig.colors.primary[600],
        align: 'center',
      })
      
      // Description
      this.renderer.drawText(platform.description, x + 50, spanY + spanHeight/2 + 26, {
        fontSize: 11,
        color: brandConfig.colors.neutral[600],
        align: 'center',
      })
    })
    
    // Group private companies by layer
    const privatesByLayer: { [key: string]: AIPlayer[] } = {}
    privateInnovators.forEach((company) => {
      const primaryLayer = company.layers[0]
      if (!privatesByLayer[primaryLayer]) {
        privatesByLayer[primaryLayer] = []
      }
      privatesByLayer[primaryLayer].push(company)
    })
    
    // Draw private companies
    layers.forEach((layer, layerIndex) => {
      const companiesInLayer = privatesByLayer[layer] || []
      const y = startY + layerIndex * layerHeight
      const maxPerRow = 6
      
      companiesInLayer.forEach((company, index) => {
        const row = Math.floor(index / maxPerRow)
        const col = index % maxPerRow
        const x = dividerX + 40 + col * 145
        const cardY = y + 35 + row * 70
        
        this.drawCompanyCard(company, x, cardY)
      })
    })
  }

  private drawCompanyCard(company: AIPlayer, x: number, y: number) {
    const width = 130
    const height = 60
    
    // Card background
    this.renderer.drawRoundedRect(x, y, width, height, 8, {
      fill: brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.08),
      stroke: brandConfig.colors.accent.neon,
      strokeWidth: 1,
    })
    
    // Company name
    this.renderer.drawText(company.name, x + 8, y + 20, {
      fontSize: 15,
      fontWeight: 600,
      color: brandConfig.colors.primary[900],
    })
    
    // Valuation
    if (company.valuation) {
      const valueText = company.valuation >= 100 
        ? `$${company.valuation}B`
        : `$${company.valuation.toFixed(1)}B`
      
      this.renderer.drawText(valueText, x + width - 8, y + 20, {
        fontSize: 16,
        fontWeight: 700,
        color: brandConfig.colors.accent.neon,
        align: 'right',
      })
    }
    
    // Growth/Description
    if (company.growth) {
      this.renderer.drawText(company.growth, x + 8, y + 38, {
        fontSize: 11,
        color: brandConfig.colors.primary[700],
      })
    }
    
    // Description
    if (company.description) {
      this.renderer.drawText(company.description, x + width - 8, y + 38, {
        fontSize: 10,
        color: brandConfig.colors.neutral[600],
        align: 'right',
        fontStyle: 'italic',
      })
    }
  }

  private drawFooter() {
    // EQUIAM branding
    this.renderer.drawText('EQUIAM', this.dimensions.width - 80, this.dimensions.height - 40, {
      fontSize: 20,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: brandConfig.colors.primary[600],
      align: 'right',
    })
    
    // Source
    this.renderer.drawText('Data: Company filings, PitchBook, Crunchbase | August 2025', 80, this.dimensions.height - 40, {
      fontSize: 12,
      color: brandConfig.colors.neutral[500],
    })
    
    // Total private value
    const totalPrivate = 300 + 170 + 62 + 19 + 13.8 + 10 + 6 + 5.5 + 5 + 4.5 + 4.1 + 4 + 3 + 2.8 + 2.8 + 2.2 + 1.5 + 1.5 + 1.3 + 5.1
    this.renderer.drawText(`Total Private AI Value: ~$${totalPrivate.toFixed(0)}B`, this.dimensions.width/2, this.dimensions.height - 40, {
      fontSize: 16,
      fontWeight: 600,
      color: brandConfig.colors.accent.neon,
      align: 'center',
    })
  }
}