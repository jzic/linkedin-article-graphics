import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface AIPlayer {
  name: string
  type: 'public' | 'private'
  layers: string[] // Which layers they play in
  valuation?: number // Only show for private companies
  growth?: string
  description: string
  logo?: string
  ticker?: string
  isPlatform?: boolean // For multi-layer players
}

export class AIEcosystemHonestVisualization {
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
    
    // Define the ecosystem players
    const publicPlatforms: AIPlayer[] = [
      {
        name: 'NVIDIA',
        type: 'public',
        ticker: 'NVDA',
        layers: ['Infrastructure', 'Cloud', 'Applications'],
        description: 'Dominates GPUs, expanding to full stack',
        logo: 'nvidia.png',
        isPlatform: true
      },
      {
        name: 'Google',
        type: 'public',
        ticker: 'GOOGL',
        layers: ['Cloud', 'Models', 'Applications'],
        description: 'Gemini, Vertex AI, Google Cloud',
        isPlatform: true
      },
      {
        name: 'Microsoft',
        type: 'public',
        ticker: 'MSFT',
        layers: ['Cloud', 'Models', 'Applications'],
        description: 'Azure, OpenAI partnership, Copilot',
        isPlatform: true
      },
      {
        name: 'Amazon',
        type: 'public',
        ticker: 'AMZN',
        layers: ['Cloud', 'Models', 'Applications'],
        description: 'AWS, Bedrock, Anthropic partnership',
        isPlatform: true
      },
      {
        name: 'Meta',
        type: 'public',
        ticker: 'META',
        layers: ['Models', 'Applications'],
        description: 'Llama models, AI for social/AR/VR',
        isPlatform: true
      }
    ]

    const publicSpecialists: AIPlayer[] = [
      {
        name: 'AMD',
        type: 'public',
        ticker: 'AMD',
        layers: ['Infrastructure'],
        description: 'GPUs challenging NVIDIA'
      },
      {
        name: 'Intel',
        type: 'public',
        ticker: 'INTC',
        layers: ['Infrastructure'],
        description: 'Gaudi AI accelerators'
      },
      {
        name: 'Palantir',
        type: 'public',
        ticker: 'PLTR',
        layers: ['Applications'],
        description: 'AIP platform for enterprise',
        logo: 'palantir.png'
      },
      {
        name: 'Snowflake',
        type: 'public',
        ticker: 'SNOW',
        layers: ['Cloud'],
        description: 'Data cloud with AI features',
        logo: 'snowflake.png'
      },
      {
        name: 'Adobe',
        type: 'public',
        ticker: 'ADBE',
        layers: ['Applications'],
        description: 'Firefly generative AI'
      }
    ]

    const privateCompanies: AIPlayer[] = [
      {
        name: 'OpenAI',
        type: 'private',
        layers: ['Models', 'Applications'],
        valuation: 300,
        growth: '$13B ARR, path to $1T',
        description: 'GPT-4, ChatGPT, expanding to apps',
        isPlatform: true
      },
      {
        name: 'Anthropic',
        type: 'private',
        layers: ['Models', 'Applications'],
        valuation: 170,
        growth: '$1B→$5B ARR in 7mo',
        description: 'Claude, enterprise AI assistant',
        logo: 'anthropic.png',
        isPlatform: true
      },
      {
        name: 'Databricks',
        type: 'private',
        layers: ['Cloud', 'Models'],
        valuation: 62,
        growth: '$2.4B ARR',
        description: 'Data + AI platform',
        logo: 'databricks.png'
      },
      {
        name: 'CoreWeave',
        type: 'private',
        layers: ['Cloud'],
        valuation: 19,
        growth: '10x YoY',
        description: 'GPU cloud specialist',
        logo: 'coreweave.png'
      },
      {
        name: 'Stripe',
        type: 'private',
        layers: ['Applications'],
        valuation: 65,
        growth: 'Adding AI features',
        description: 'Payments with AI fraud detection',
        logo: 'stripe.png'
      },
      {
        name: 'Scale AI',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 13.8,
        growth: '$600M ARR',
        description: 'Data labeling for AI training'
      },
      {
        name: 'Mistral AI',
        type: 'private',
        layers: ['Models'],
        valuation: 6,
        growth: '$0→$150M in 1yr',
        description: 'European LLM leader'
      },
      {
        name: 'Cohere',
        type: 'private',
        layers: ['Models'],
        valuation: 5.5,
        growth: '4x YoY',
        description: 'Enterprise LLMs'
      },
      {
        name: 'Hugging Face',
        type: 'private',
        layers: ['Models', 'Infrastructure'],
        valuation: 4.5,
        growth: '10M+ users',
        description: 'AI model hub & tools'
      },
      {
        name: 'Character.AI',
        type: 'private',
        layers: ['Applications'],
        valuation: 5,
        growth: '20M MAU',
        description: 'AI companions'
      },
      {
        name: 'Perplexity',
        type: 'private',
        layers: ['Applications'],
        valuation: 3,
        growth: '15M MAU',
        description: 'AI-powered search'
      },
      {
        name: 'Midjourney',
        type: 'private',
        layers: ['Applications'],
        valuation: 10,
        growth: '20M+ users',
        description: 'Image generation'
      },
      {
        name: 'Cerebras',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 4.1,
        growth: 'Wafer-scale chips',
        description: 'AI-specific processors'
      },
      {
        name: 'Groq',
        type: 'private',
        layers: ['Infrastructure'],
        valuation: 2.8,
        growth: 'Fastest inference',
        description: 'LPU chips for AI'
      }
    ]

    // Preload logos
    await this.preloadLogos([...publicPlatforms, ...publicSpecialists, ...privateCompanies])
    
    // Draw the ecosystem map
    this.drawEcosystemMap(publicPlatforms, publicSpecialists, privateCompanies)
    
    // Draw insights
    this.drawKeyInsights()
    
    // Add branding
    this.drawBranding()
  }

  private drawHeader() {
    const padding = 60
    
    // Title
    this.renderer.drawText('The AI Ecosystem: Who Actually Plays Where', padding, 55, {
      fontSize: 44,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: brandConfig.colors.primary[900],
    })
    
    // Subtitle
    this.renderer.drawText('Big Tech platforms span multiple layers while private companies dominate specialized innovation', padding, 90, {
      fontSize: 20,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: brandConfig.colors.foreground.secondary,
    })
  }

  private drawEcosystemMap(
    publicPlatforms: AIPlayer[],
    publicSpecialists: AIPlayer[],
    privateCompanies: AIPlayer[]
  ) {
    const startY = 130
    const layerHeight = 120
    const layers = ['Applications', 'Models', 'Cloud', 'Infrastructure']
    const padding = 60
    const width = this.dimensions.width - padding * 2
    
    // Draw layer backgrounds
    layers.forEach((layer, index) => {
      const y = startY + index * layerHeight
      
      // Layer background
      this.renderer.drawRoundedRect(padding, y, width, layerHeight - 5, 12, {
        fill: '#FAFBFC',
        stroke: brandConfig.colors.neutral[200],
        strokeWidth: 1,
      })
      
      // Layer label
      this.renderer.drawText(layer.toUpperCase(), padding + 20, y + 25, {
        fontSize: 14,
        fontWeight: 700,
        color: brandConfig.colors.primary[600],
        letterSpacing: 1,
      })
    })
    
    // Draw vertical divider between public and private
    const dividerX = padding + width * 0.5
    this.ctx.strokeStyle = brandConfig.colors.primary[300]
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([10, 5])
    this.ctx.beginPath()
    this.ctx.moveTo(dividerX, startY - 10)
    this.ctx.lineTo(dividerX, startY + layers.length * layerHeight - 10)
    this.ctx.stroke()
    this.ctx.setLineDash([])
    
    // Section headers
    this.renderer.drawText('PUBLIC COMPANIES', padding + 100, startY - 20, {
      fontSize: 16,
      fontWeight: 700,
      color: brandConfig.colors.neutral[600],
      letterSpacing: 1,
    })
    
    this.renderer.drawText('PRIVATE COMPANIES', dividerX + 100, startY - 20, {
      fontSize: 16,
      fontWeight: 700,
      color: brandConfig.colors.accent.neon,
      letterSpacing: 1,
    })
    
    // Draw public platforms (span multiple layers)
    const platformX = padding + 50
    const platformWidth = 80
    publicPlatforms.forEach((platform, index) => {
      const x = platformX + index * (platformWidth + 15)
      
      // Find which layers this platform spans
      const layerIndices = platform.layers.map(l => layers.indexOf(l))
      const minLayer = Math.min(...layerIndices)
      const maxLayer = Math.max(...layerIndices)
      const spanY = startY + minLayer * layerHeight + 35
      const spanHeight = (maxLayer - minLayer + 1) * layerHeight - 40
      
      // Draw spanning box
      this.renderer.drawRoundedRect(x, spanY, platformWidth, spanHeight, 8, {
        fill: brandUtils.hexToRgba(brandConfig.colors.primary[100], 0.3),
        stroke: brandConfig.colors.primary[400],
        strokeWidth: 2,
      })
      
      // Company name
      this.renderer.drawText(platform.name, x + platformWidth/2, spanY + spanHeight/2 - 10, {
        fontSize: 14,
        fontWeight: 700,
        color: brandConfig.colors.primary[700],
        align: 'center',
      })
      
      // Ticker
      if (platform.ticker) {
        this.renderer.drawText(platform.ticker, x + platformWidth/2, spanY + spanHeight/2 + 8, {
          fontSize: 11,
          color: brandConfig.colors.neutral[500],
          align: 'center',
        })
      }
      
      // Description
      this.drawWrappedText(platform.description, x + platformWidth/2, spanY + spanHeight/2 + 25, platformWidth - 10, 10)
    })
    
    // Draw public specialists in their specific layers
    publicSpecialists.forEach((company) => {
      const layerIndex = layers.indexOf(company.layers[0])
      const y = startY + layerIndex * layerHeight + 35
      const x = padding + 450
      
      this.drawCompanyBadge(company, x, y, false)
    })
    
    // Draw private companies
    const privateStartX = dividerX + 30
    const privatesByLayer: { [key: string]: AIPlayer[] } = {}
    
    // Group private companies by their primary layer
    privateCompanies.forEach((company) => {
      const primaryLayer = company.layers[0]
      if (!privatesByLayer[primaryLayer]) {
        privatesByLayer[primaryLayer] = []
      }
      privatesByLayer[primaryLayer].push(company)
    })
    
    // Draw them organized by layer
    layers.forEach((layer, layerIndex) => {
      const companiesInLayer = privatesByLayer[layer] || []
      const y = startY + layerIndex * layerHeight + 35
      
      companiesInLayer.forEach((company, index) => {
        const x = privateStartX + index * 95
        this.drawCompanyBadge(company, x, y, true)
      })
    })
  }

  private drawCompanyBadge(company: AIPlayer, x: number, y: number, showValuation: boolean) {
    const width = 85
    const height = 65
    
    // Badge background
    this.renderer.drawRoundedRect(x, y, width, height, 6, {
      fill: company.type === 'private' 
        ? brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.05)
        : brandUtils.hexToRgba(brandConfig.colors.primary[100], 0.5),
      stroke: company.type === 'private'
        ? brandConfig.colors.accent.neon
        : brandConfig.colors.primary[300],
      strokeWidth: 1,
    })
    
    // Company name
    this.renderer.drawText(company.name, x + width/2, y + 15, {
      fontSize: 11,
      fontWeight: 600,
      color: brandConfig.colors.foreground.primary,
      align: 'center',
    })
    
    // Valuation (private only)
    if (showValuation && company.valuation) {
      const valueText = company.valuation >= 100 
        ? `$${company.valuation}B`
        : `$${company.valuation.toFixed(1)}B`
      
      this.renderer.drawText(valueText, x + width/2, y + 32, {
        fontSize: 13,
        fontWeight: 700,
        color: brandConfig.colors.accent.neon,
        align: 'center',
      })
    } else if (company.ticker) {
      this.renderer.drawText(company.ticker, x + width/2, y + 32, {
        fontSize: 10,
        color: brandConfig.colors.neutral[500],
        align: 'center',
      })
    }
    
    // Growth (if available)
    if (company.growth && showValuation) {
      this.renderer.drawText(company.growth, x + width/2, y + 48, {
        fontSize: 9,
        color: brandConfig.colors.neutral[600],
        align: 'center',
        fontStyle: 'italic',
      })
    }
  }

  private drawWrappedText(text: string, x: number, y: number, maxWidth: number, fontSize: number) {
    const words = text.split(' ')
    let line = ''
    let lineY = y
    
    words.forEach((word) => {
      const testLine = line + word + ' '
      const metrics = this.ctx.measureText(testLine)
      
      if (metrics.width > maxWidth && line !== '') {
        this.renderer.drawText(line.trim(), x, lineY, {
          fontSize,
          color: brandConfig.colors.neutral[500],
          align: 'center',
        })
        line = word + ' '
        lineY += fontSize + 2
      } else {
        line = testLine
      }
    })
    
    if (line) {
      this.renderer.drawText(line.trim(), x, lineY, {
        fontSize,
        color: brandConfig.colors.neutral[500],
        align: 'center',
      })
    }
  }

  private drawKeyInsights() {
    const boxY = this.dimensions.height - 200
    const padding = 60
    
    // Insights box
    this.renderer.drawRoundedRect(padding, boxY, this.dimensions.width - padding * 2, 140, 16, {
      fill: brandUtils.hexToRgba(brandConfig.colors.primary[50], 0.5),
      stroke: brandConfig.colors.primary[600],
      strokeWidth: 2,
    })
    
    // Title
    this.renderer.drawText('THE KEY INSIGHT', padding + 30, boxY + 30, {
      fontSize: 18,
      fontWeight: 700,
      color: brandConfig.colors.primary[600],
      letterSpacing: 1,
    })
    
    // Two-column insights
    const leftInsights = [
      'Big Tech platforms (NVIDIA, Google, Microsoft, Amazon, Meta) dominate public AI',
      'But they\'re building general platforms, not specialized innovation',
      'Public market "pure plays" are limited to chips and legacy software'
    ]
    
    const rightInsights = [
      'Private companies worth $600B+ are the specialists driving breakthrough innovation',
      'OpenAI ($300B) + Anthropic ($170B) = Nearly half a trillion in private value',
      'Growth rates: Anthropic 1000%+, Mistral 0→$150M in 1 year, CoreWeave 10x'
    ]
    
    leftInsights.forEach((insight, index) => {
      this.renderer.drawText(`• ${insight}`, padding + 30, boxY + 55 + index * 22, {
        fontSize: 13,
        color: brandConfig.colors.foreground.primary,
      })
    })
    
    rightInsights.forEach((insight, index) => {
      this.renderer.drawText(`• ${insight}`, padding + 600, boxY + 55 + index * 22, {
        fontSize: 13,
        color: brandConfig.colors.foreground.primary,
      })
    })
    
    // Bottom line message
    this.renderer.drawRoundedRect(padding + 20, boxY + 125, this.dimensions.width - padding * 2 - 40, 30, 8, {
      fill: brandConfig.colors.accent.alert,
    })
    
    this.renderer.drawText(
      'Reality: You get platforms through public markets, but innovation through private markets',
      this.dimensions.width / 2,
      boxY + 144,
      {
        fontSize: 15,
        fontWeight: 600,
        color: '#FFFFFF',
        align: 'center',
      }
    )
  }

  private drawBranding() {
    // EQUIAM watermark
    this.renderer.drawText('EQUIAM', this.dimensions.width - 60, this.dimensions.height - 25, {
      fontSize: 16,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.4),
      align: 'right',
    })
    
    // Note
    this.renderer.drawText('Note: Public companies shown without market caps as they span multiple business lines beyond AI', 60, this.dimensions.height - 25, {
      fontSize: 10,
      color: brandConfig.colors.neutral[400],
      fontStyle: 'italic',
    })
  }

  private async preloadLogos(companies: AIPlayer[]): Promise<void> {
    // Logo loading logic (simplified for now)
    return Promise.resolve()
  }
}