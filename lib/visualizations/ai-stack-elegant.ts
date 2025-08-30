import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface Company {
  name: string
  ticker?: string
  marketCap?: number
  valuation?: number
  logo: string
  dominance?: string
  model?: string
  product?: string
  revenue?: string
  aiRevenue?: string
  funding?: string
  users?: string
  growth?: string
  description?: string
}

interface Layer {
  name: string
  description: string
  color: string
  publicCompanies: Company[]
  privateCompanies: Company[]
}

export class AIStackElegantVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private theme: 'light' | 'dark'
  private loadedLogos: Map<string, HTMLImageElement> = new Map()

  constructor(
    renderer: CanvasRenderer, 
    dimensions: { width: number; height: number },
    theme: 'light' | 'dark' = 'light'
  ) {
    this.renderer = renderer
    this.dimensions = dimensions
    this.theme = theme
  }

  async render(stackData: any) {
    // Set sophisticated background
    this.drawBackground()
    
    // Draw header
    this.drawHeader()
    
    // Preload logos (we'll use initials as fallback)
    await this.preloadLogos(stackData.aiStack)
    
    // Draw the four layers
    const layers = [
      stackData.aiStack.applications,
      stackData.aiStack.models,
      stackData.aiStack.cloud,
      stackData.aiStack.infrastructure
    ]
    
    const layerHeight = (this.dimensions.height - 200) / 4
    const startY = 140
    
    layers.forEach((layer, index) => {
      this.drawLayer(layer, startY + index * layerHeight, layerHeight - 10)
    })
    
    // Draw insights panel
    this.drawInsightsPanel(stackData.marketInsights)
    
    // Add watermark
    this.drawWatermark()
  }

  private drawBackground() {
    if (this.theme === 'dark') {
      // Sophisticated dark gradient
      this.renderer.drawGradientBackground(
        ['#0A0E27', '#1A2352', '#0A0E27'],
        'vertical'
      )
    } else {
      // Clean light background with subtle gradient
      this.renderer.drawGradientBackground(
        ['#FFFFFF', '#F8FAFF', '#F3F4F6'],
        'vertical'
      )
    }
  }

  private drawHeader() {
    const padding = 48
    const titleColor = this.theme === 'dark' ? '#FFFFFF' : brandConfig.colors.foreground.primary
    const subtitleColor = this.theme === 'dark' ? '#C3D3F4' : brandConfig.colors.foreground.secondary
    
    // Main title
    this.renderer.drawText('The AI Technology Stack', padding, padding + 45, {
      fontSize: 48,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: titleColor,
    })
    
    // Subtitle
    this.renderer.drawText('Public Markets Capture Only 30% of AI Innovation', padding, padding + 80, {
      fontSize: 22,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: subtitleColor,
    })
  }

  private drawLayer(layer: Layer, y: number, height: number) {
    const padding = 48
    const width = this.dimensions.width - padding * 2
    
    // Layer container with elegant styling
    const gradient = this.renderer.ctx.createLinearGradient(padding, y, padding + width, y)
    gradient.addColorStop(0, brandUtils.hexToRgba(layer.color, 0.03))
    gradient.addColorStop(0.5, brandUtils.hexToRgba(layer.color, 0.08))
    gradient.addColorStop(1, brandUtils.hexToRgba(layer.color, 0.03))
    
    this.renderer.drawRoundedRect(padding, y, width, height, 16, {
      fill: gradient,
      stroke: brandUtils.hexToRgba(layer.color, 0.3),
      strokeWidth: 1,
    })
    
    // Layer header
    const headerHeight = 40
    this.renderer.drawRoundedRect(padding, y, width, headerHeight, 16, {
      fill: brandUtils.hexToRgba(layer.color, 0.1),
    })
    
    // Layer name
    this.renderer.drawText(layer.name, padding + 24, y + 26, {
      fontSize: 20,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 600,
      color: layer.color,
    })
    
    // Layer description
    this.renderer.drawText(layer.description, padding + 300, y + 26, {
      fontSize: 14,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: this.theme === 'dark' ? '#9CA3AF' : brandConfig.colors.foreground.tertiary,
    })
    
    // Calculate split point (visual divider between public and private)
    const splitX = padding + width * 0.45
    
    // Draw divider line
    this.renderer.ctx.strokeStyle = brandUtils.hexToRgba(layer.color, 0.2)
    this.renderer.ctx.lineWidth = 2
    this.renderer.ctx.setLineDash([8, 4])
    this.renderer.ctx.beginPath()
    this.renderer.ctx.moveTo(splitX, y + headerHeight + 10)
    this.renderer.ctx.lineTo(splitX, y + height - 10)
    this.renderer.ctx.stroke()
    this.renderer.ctx.setLineDash([])
    
    // Public section label
    this.drawSectionLabel('PUBLIC MARKETS', padding + 24, y + headerHeight + 20, '#6B7280')
    
    // Private section label  
    this.drawSectionLabel('PRIVATE MARKETS', splitX + 24, y + headerHeight + 20, brandConfig.colors.accent.neon)
    
    // Draw companies
    const logoSize = 50
    const logoSpacing = 15
    const startYLogos = y + headerHeight + 45
    
    // Public companies (left side)
    this.drawCompanyLogos(
      layer.publicCompanies, 
      padding + 24, 
      startYLogos,
      splitX - padding - 48,
      logoSize,
      logoSpacing,
      false
    )
    
    // Private companies (right side)
    this.drawCompanyLogos(
      layer.privateCompanies,
      splitX + 24,
      startYLogos,
      padding + width - splitX - 48,
      logoSize,
      logoSpacing,
      true
    )
    
    // Value indicators
    const publicValue = this.calculateTotalValue(layer.publicCompanies)
    const privateValue = this.calculateTotalValue(layer.privateCompanies)
    
    // Public value
    this.renderer.drawText(`$${this.formatValue(publicValue)}`, splitX - 24, y + height - 15, {
      fontSize: 16,
      fontWeight: 600,
      color: '#6B7280',
      align: 'right',
    })
    
    // Private value
    this.renderer.drawText(`$${this.formatValue(privateValue)}`, padding + width - 24, y + height - 15, {
      fontSize: 16,
      fontWeight: 600,
      color: brandConfig.colors.accent.neon,
      align: 'right',
    })
  }

  private drawSectionLabel(text: string, x: number, y: number, color: string) {
    this.renderer.drawText(text, x, y, {
      fontSize: 11,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 600,
      color: color,
      letterSpacing: 1.5,
    })
  }

  private drawCompanyLogos(
    companies: Company[],
    x: number,
    y: number,
    maxWidth: number,
    logoSize: number,
    spacing: number,
    isPrivate: boolean
  ) {
    const itemWidth = logoSize + spacing
    const itemsPerRow = Math.floor(maxWidth / itemWidth)
    const rows = Math.ceil(companies.length / itemsPerRow)
    
    companies.forEach((company, index) => {
      const row = Math.floor(index / itemsPerRow)
      const col = index % itemsPerRow
      const logoX = x + col * itemWidth
      const logoY = y + row * (logoSize + 5)
      
      // Draw logo container
      const bgColor = isPrivate 
        ? brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.05)
        : brandUtils.hexToRgba('#6B7280', 0.05)
      
      const borderColor = isPrivate
        ? brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.3)
        : brandUtils.hexToRgba('#6B7280', 0.2)
      
      this.renderer.drawRoundedRect(logoX, logoY, logoSize, logoSize, 8, {
        fill: bgColor,
        stroke: borderColor,
        strokeWidth: 1,
      })
      
      // Draw company initial or logo placeholder
      const initial = company.name.charAt(0)
      const textColor = isPrivate ? brandConfig.colors.accent.neon : '#6B7280'
      
      this.renderer.drawText(initial, logoX + logoSize/2, logoY + logoSize/2 + 6, {
        fontSize: 20,
        fontWeight: 700,
        color: textColor,
        align: 'center',
      })
      
      // Company name (tiny, below logo)
      this.renderer.drawText(company.ticker || company.name.substring(0, 8), logoX + logoSize/2, logoY + logoSize + 12, {
        fontSize: 9,
        color: this.theme === 'dark' ? '#9CA3AF' : '#6B7280',
        align: 'center',
      })
      
      // Valuation badge for significant companies
      if ((company.marketCap && company.marketCap > 1000) || (company.valuation && company.valuation > 100)) {
        const value = company.marketCap || company.valuation || 0
        const label = value > 1000 ? `${(value/1000).toFixed(1)}T` : `${value.toFixed(0)}B`
        
        // Badge
        this.renderer.drawRoundedRect(logoX + logoSize - 20, logoY - 5, 25, 12, 6, {
          fill: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.primary[600],
        })
        
        this.renderer.drawText(label, logoX + logoSize - 7, logoY + 4, {
          fontSize: 8,
          fontWeight: 600,
          color: '#FFFFFF',
          align: 'center',
        })
      }
    })
  }

  private drawInsightsPanel(insights: any) {
    const panelWidth = 400
    const panelHeight = 250
    const x = this.dimensions.width - panelWidth - 48
    const y = 160
    
    // Panel background
    const bgColor = this.theme === 'dark'
      ? brandUtils.hexToRgba('#0F1538', 0.9)
      : brandUtils.hexToRgba('#FFFFFF', 0.95)
    
    this.renderer.drawRoundedRect(x, y, panelWidth, panelHeight, 16, {
      fill: bgColor,
      stroke: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.2),
      strokeWidth: 1,
      shadow: brandConfig.shadows.xl,
    })
    
    // Title
    this.renderer.drawText('Market Reality', x + 24, y + 30, {
      fontSize: 20,
      fontWeight: 600,
      color: brandConfig.colors.primary[600],
    })
    
    // Key metrics
    const metrics = [
      { label: 'Public Market Cap', value: `$${(insights.totalPublicMarketCap/1000).toFixed(1)}T`, color: '#6B7280' },
      { label: 'Private Valuations', value: `$${insights.totalPrivateValuation.toFixed(0)}B`, color: brandConfig.colors.accent.neon },
      { label: 'Private Share of Innovation', value: '70%', color: brandConfig.colors.accent.neon },
    ]
    
    metrics.forEach((metric, index) => {
      const metricY = y + 70 + index * 35
      
      this.renderer.drawText(metric.label, x + 24, metricY, {
        fontSize: 13,
        color: this.theme === 'dark' ? '#9CA3AF' : '#6B7280',
      })
      
      this.renderer.drawText(metric.value, x + panelWidth - 24, metricY, {
        fontSize: 16,
        fontWeight: 600,
        color: metric.color,
        align: 'right',
      })
    })
    
    // Divider
    this.renderer.ctx.strokeStyle = brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.1)
    this.renderer.ctx.lineWidth = 1
    this.renderer.ctx.beginPath()
    this.renderer.ctx.moveTo(x + 24, y + 180)
    this.renderer.ctx.lineTo(x + panelWidth - 24, y + 180)
    this.renderer.ctx.stroke()
    
    // Key insight
    this.renderer.drawText('Missing 70% of AI innovation', x + 24, y + 210, {
      fontSize: 14,
      fontWeight: 500,
      color: brandConfig.colors.accent.alert,
    })
    
    this.renderer.drawText('with public-only exposure', x + 24, y + 228, {
      fontSize: 14,
      fontWeight: 500,
      color: brandConfig.colors.accent.alert,
    })
  }

  private drawWatermark() {
    this.renderer.drawText('EQUIAM', this.dimensions.width - 48, this.dimensions.height - 30, {
      fontSize: 14,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.3),
      align: 'right',
    })
  }

  private async preloadLogos(stack: any): Promise<void> {
    // In a real implementation, we'd load actual logo files
    // For now, we'll use the initials as shown in drawCompanyLogos
    return Promise.resolve()
  }

  private calculateTotalValue(companies: Company[]): number {
    return companies.reduce((sum, c) => sum + (c.marketCap || c.valuation || 0), 0)
  }

  private formatValue(value: number): string {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}T`
    }
    return `${value.toFixed(0)}B`
  }
}