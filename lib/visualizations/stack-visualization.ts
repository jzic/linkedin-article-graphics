import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'
import { Sector, VisualizationConfig } from '@/types'

export class StackVisualization {
  private renderer: CanvasRenderer
  private config: VisualizationConfig

  constructor(renderer: CanvasRenderer, config: VisualizationConfig) {
    this.renderer = renderer
    this.config = config
  }

  render() {
    const { sectors, dimensions, theme = 'light' } = this.config
    
    // Set background
    if (theme === 'dark') {
      this.renderer.drawGradientBackground(
        [brandConfig.colors.primary[900], brandConfig.colors.primary[800]],
        'vertical'
      )
    } else {
      this.renderer.clear(brandConfig.colors.background.primary)
    }

    // Draw header
    this.drawHeader()

    // Focus on AI sector with sub-sectors for this visualization
    const aiSector = sectors.find(s => s.id === 'ai')
    if (aiSector && aiSector.subSectors) {
      this.drawStackLayers(aiSector, dimensions)
    }

    // Watermark
    if (this.config.showWatermark) {
      this.renderer.drawWatermark()
    }
  }

  private drawHeader() {
    const { dimensions } = this.config
    const padding = brandConfig.spacing.xl
    
    // Title
    this.renderer.drawText('The AI Technology Stack', padding, padding + 40, {
      fontSize: brandUtils.scaleFontSize(brandConfig.typography.fontSize.h2, dimensions.width),
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: brandConfig.typography.fontWeight.bold,
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral.white : brandConfig.colors.foreground.primary,
    })

    // Subtitle
    this.renderer.drawText('Private companies dominate the innovation layers', padding, padding + 75, {
      fontSize: brandUtils.scaleFontSize(brandConfig.typography.fontSize.bodyLarge, dimensions.width),
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral[300] : brandConfig.colors.foreground.secondary,
    })
  }

  private drawStackLayers(sector: any, dimensions: any) {
    const padding = brandConfig.spacing.xl
    const startY = 140
    const layerHeight = 120
    const layerSpacing = 20
    const width = dimensions.width - padding * 2

    const layers = [
      { name: 'Applications', color: brandConfig.colors.accent.neon, icon: '🎨' },
      { name: 'Foundation Models', color: brandConfig.colors.primary[600], icon: '🧠' },
      { name: 'Cloud/Compute', color: brandConfig.colors.accent.dataViz, icon: '☁️' },
      { name: 'Infrastructure/Hardware', color: brandConfig.colors.accent.gold, icon: '🔧' },
    ]

    layers.forEach((layer, index) => {
      const y = startY + index * (layerHeight + layerSpacing)
      const subSector = sector.subSectors.find((ss: any) => ss.name === layer.name)
      
      if (subSector) {
        this.drawLayer(
          layer.name,
          layer.color,
          layer.icon,
          subSector.publicCompanies || [],
          subSector.privateCompanies || [],
          padding,
          y,
          width,
          layerHeight
        )
      }
    })

    // Draw connecting lines between layers
    this.drawStackConnections(padding, startY, width, layerHeight, layerSpacing, layers.length)

    // Add key insights
    this.drawStackInsights(dimensions.width - 350, startY + 50)
  }

  private drawLayer(
    name: string,
    color: string,
    icon: string,
    publicCompanies: any[],
    privateCompanies: any[],
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    // Layer background
    this.renderer.drawRoundedRect(x, y, width, height, brandConfig.borderRadius.lg, {
      fill: brandUtils.hexToRgba(color, 0.05),
      stroke: color,
      strokeWidth: 2,
    })

    // Layer name and icon
    this.renderer.drawText(`${icon} ${name}`, x + 20, y + 30, {
      fontSize: 20,
      fontWeight: brandConfig.typography.fontWeight.semibold,
      color: color,
    })

    // Calculate public vs private ratio
    const totalValue = this.getTotalValue(publicCompanies) + this.getTotalValue(privateCompanies)
    const privateRatio = totalValue > 0 ? this.getTotalValue(privateCompanies) / totalValue : 0

    // Draw ratio bar
    const barY = y + 50
    const barHeight = 8
    const barWidth = width - 40

    // Background
    this.renderer.drawRoundedRect(x + 20, barY, barWidth, barHeight, barHeight / 2, {
      fill: brandConfig.colors.neutral[200],
    })

    // Private portion
    if (privateRatio > 0) {
      this.renderer.drawRoundedRect(x + 20, barY, barWidth * privateRatio, barHeight, barHeight / 2, {
        fill: brandConfig.colors.accent.neon,
      })
    }

    // Percentage label
    this.renderer.drawText(`${Math.round(privateRatio * 100)}% Private`, x + width - 100, y + 30, {
      fontSize: 14,
      fontWeight: brandConfig.typography.fontWeight.medium,
      color: brandConfig.colors.accent.neon,
      align: 'right',
    })

    // Company logos section
    this.drawCompanyLogos(publicCompanies, privateCompanies, x + 20, y + 70, width - 40, 35)
  }

  private drawCompanyLogos(
    publicCompanies: any[],
    privateCompanies: any[],
    x: number,
    y: number,
    width: number,
    logoSize: number
  ) {
    const totalCompanies = publicCompanies.length + privateCompanies.length
    const maxLogos = Math.floor(width / (logoSize + 10))
    
    // Draw public company names (grayed out)
    let currentX = x
    publicCompanies.slice(0, Math.floor(maxLogos / 2)).forEach((company) => {
      // Draw company name as placeholder for logo
      this.renderer.drawRoundedRect(currentX, y, logoSize, logoSize, 4, {
        fill: brandConfig.colors.neutral[100],
        stroke: brandConfig.colors.neutral[300],
      })
      
      // Company initial
      const initial = company.name.charAt(0)
      this.renderer.drawText(initial, currentX + logoSize / 2, y + logoSize / 2 + 5, {
        fontSize: 16,
        fontWeight: brandConfig.typography.fontWeight.bold,
        color: brandConfig.colors.neutral[400],
        align: 'center',
      })
      
      currentX += logoSize + 10
    })

    // Draw private company names (highlighted)
    privateCompanies.slice(0, Math.floor(maxLogos / 2)).forEach((company) => {
      // Draw company name as placeholder for logo
      this.renderer.drawRoundedRect(currentX, y, logoSize, logoSize, 4, {
        fill: brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.1),
        stroke: brandConfig.colors.accent.neon,
      })
      
      // Company initial
      const initial = company.name.charAt(0)
      this.renderer.drawText(initial, currentX + logoSize / 2, y + logoSize / 2 + 5, {
        fontSize: 16,
        fontWeight: brandConfig.typography.fontWeight.bold,
        color: brandConfig.colors.accent.neon,
        align: 'center',
      })
      
      currentX += logoSize + 10
    })

    // Show overflow indicator
    if (totalCompanies > maxLogos) {
      this.renderer.drawText(`+${totalCompanies - maxLogos}`, currentX, y + logoSize / 2 + 5, {
        fontSize: 14,
        color: brandConfig.colors.foreground.tertiary,
        fontStyle: 'italic',
      })
    }
  }

  private drawStackConnections(
    x: number,
    y: number,
    width: number,
    layerHeight: number,
    spacing: number,
    layerCount: number
  ) {
    // Draw subtle connecting lines between layers
    for (let i = 0; i < layerCount - 1; i++) {
      const lineY = y + layerHeight + (i * (layerHeight + spacing)) + spacing / 2
      const lineX = x + width / 2
      
      // Vertical connector
      this.renderer.ctx.strokeStyle = brandConfig.colors.neutral[300]
      this.renderer.ctx.lineWidth = 2
      this.renderer.ctx.setLineDash([5, 5])
      this.renderer.ctx.beginPath()
      this.renderer.ctx.moveTo(lineX, lineY - spacing / 2)
      this.renderer.ctx.lineTo(lineX, lineY + spacing / 2)
      this.renderer.ctx.stroke()
      this.renderer.ctx.setLineDash([])
    }
  }

  private drawStackInsights(x: number, y: number) {
    const bgColor = this.config.theme === 'dark' 
      ? brandUtils.hexToRgba(brandConfig.colors.primary[800], 0.8)
      : brandUtils.hexToRgba(brandConfig.colors.neutral[50], 0.95)
    
    // Insights card
    this.renderer.drawRoundedRect(x, y, 320, 280, brandConfig.borderRadius.xl, {
      fill: bgColor,
      shadow: brandConfig.shadows.lg,
    })
    
    // Title
    this.renderer.drawText('Stack Analysis', x + 20, y + 30, {
      fontSize: 18,
      fontWeight: brandConfig.typography.fontWeight.semibold,
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral.white : brandConfig.colors.foreground.primary,
    })
    
    // Key insights
    const insights = [
      { label: 'Apps Layer', value: '85% Private', color: brandConfig.colors.accent.neon },
      { label: 'Models Layer', value: '70% Private', color: brandConfig.colors.primary[600] },
      { label: 'Cloud Layer', value: '40% Private', color: brandConfig.colors.accent.dataViz },
      { label: 'Hardware', value: '25% Private', color: brandConfig.colors.accent.gold },
    ]
    
    insights.forEach((insight, index) => {
      const insightY = y + 70 + index * 45
      
      // Color indicator
      this.renderer.drawRoundedRect(x + 20, insightY - 5, 8, 8, 2, {
        fill: insight.color,
      })
      
      // Label
      this.renderer.drawText(insight.label, x + 40, insightY, {
        fontSize: 14,
        color: this.config.theme === 'dark' ? brandConfig.colors.neutral[300] : brandConfig.colors.foreground.secondary,
      })
      
      // Value
      this.renderer.drawText(insight.value, x + 280, insightY, {
        fontSize: 14,
        fontWeight: brandConfig.typography.fontWeight.bold,
        color: insight.color,
        align: 'right',
      })
    })
    
    // Bottom message
    this.renderer.drawText('Innovation happens at the edge', x + 20, y + 250, {
      fontSize: 12,
      fontStyle: 'italic',
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral[400] : brandConfig.colors.foreground.tertiary,
    })
  }

  private getTotalValue(companies: any[]): number {
    return companies.reduce((sum, c) => sum + (c.marketCap || c.valuation || 0), 0)
  }
}