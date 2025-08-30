import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'
import { Sector, VisualizationConfig } from '@/types'

export class ComparisonChartVisualization {
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

    // Calculate chart area
    const padding = brandConfig.spacing.xl
    const chartAreaY = 150
    const chartAreaHeight = dimensions.height - chartAreaY - padding * 2
    const chartAreaWidth = dimensions.width - padding * 2

    // Draw comparison chart
    this.drawComparisonBars(sectors, padding, chartAreaY, chartAreaWidth, chartAreaHeight)

    // Draw legend
    this.drawLegend(padding, dimensions.height - padding - 40)

    // Draw insights
    this.drawInsights(sectors, dimensions.width - 350, chartAreaY)

    // Watermark
    if (this.config.showWatermark) {
      this.renderer.drawWatermark()
    }
  }

  private drawHeader() {
    const { dimensions, title = 'Public vs Private Market Exposure', subtitle } = this.config
    const padding = brandConfig.spacing.xl
    
    // Main title
    this.renderer.drawText(title, padding, padding + 40, {
      fontSize: brandUtils.scaleFontSize(brandConfig.typography.fontSize.h2, dimensions.width),
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: brandConfig.typography.fontWeight.bold,
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral.white : brandConfig.colors.foreground.primary,
    })

    // Subtitle
    const defaultSubtitle = 'Comparing market capitalization and growth potential across sectors'
    this.renderer.drawText(subtitle || defaultSubtitle, padding, padding + 75, {
      fontSize: brandUtils.scaleFontSize(brandConfig.typography.fontSize.bodyLarge, dimensions.width),
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral[300] : brandConfig.colors.foreground.secondary,
    })
  }

  private drawComparisonBars(
    sectors: Sector[],
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const barGroupWidth = (width - brandConfig.spacing.lg * (sectors.length - 1)) / sectors.length
    const barWidth = (barGroupWidth - brandConfig.spacing.sm) / 2
    const maxValue = this.getMaxMarketValue(sectors)

    sectors.forEach((sector, index) => {
      const groupX = x + index * (barGroupWidth + brandConfig.spacing.lg)
      
      // Calculate values
      const publicValue = this.getPublicMarketCap(sector)
      const privateValue = this.getPrivateValuation(sector)
      
      // Scale heights
      const publicHeight = (publicValue / maxValue) * (height - 60)
      const privateHeight = (privateValue / maxValue) * (height - 60)
      
      // Draw public bar
      const publicBarX = groupX
      const publicBarY = y + height - 60 - publicHeight
      
      this.renderer.drawRoundedRect(publicBarX, publicBarY, barWidth, publicHeight, brandConfig.borderRadius.sm, {
        fill: brandConfig.colors.primary[600],
        shadow: brandConfig.shadows.sm,
      })
      
      // Draw private bar
      const privateBarX = groupX + barWidth + brandConfig.spacing.sm
      const privateBarY = y + height - 60 - privateHeight
      
      this.renderer.drawRoundedRect(privateBarX, privateBarY, barWidth, privateHeight, brandConfig.borderRadius.sm, {
        fill: brandConfig.colors.accent.neon,
        shadow: brandConfig.shadows.sm,
      })
      
      // Value labels
      this.renderer.drawText(`$${publicValue.toFixed(0)}B`, publicBarX + barWidth / 2, publicBarY - 8, {
        fontSize: brandUtils.scaleFontSize(12, this.config.dimensions.width),
        fontWeight: brandConfig.typography.fontWeight.medium,
        align: 'center',
        color: this.config.theme === 'dark' ? brandConfig.colors.neutral[300] : brandConfig.colors.foreground.secondary,
      })
      
      this.renderer.drawText(`$${privateValue.toFixed(0)}B`, privateBarX + barWidth / 2, privateBarY - 8, {
        fontSize: brandUtils.scaleFontSize(12, this.config.dimensions.width),
        fontWeight: brandConfig.typography.fontWeight.medium,
        align: 'center',
        color: this.config.theme === 'dark' ? brandConfig.colors.neutral[300] : brandConfig.colors.foreground.secondary,
      })
      
      // Sector label
      this.renderer.drawText(sector.name, groupX + barGroupWidth / 2, y + height - 35, {
        fontSize: brandUtils.scaleFontSize(14, this.config.dimensions.width),
        align: 'center',
        color: this.config.theme === 'dark' ? brandConfig.colors.neutral[200] : brandConfig.colors.foreground.primary,
        maxWidth: barGroupWidth,
      })
      
      // Growth rate indicator
      if (sector.averageGrowthRate) {
        const growthY = y + height - 15
        this.renderer.drawText(`+${sector.averageGrowthRate}%`, groupX + barGroupWidth / 2, growthY, {
          fontSize: brandUtils.scaleFontSize(11, this.config.dimensions.width),
          align: 'center',
          color: brandConfig.colors.accent.neon,
          fontWeight: brandConfig.typography.fontWeight.medium,
        })
      }
    })
  }

  private drawLegend(x: number, y: number) {
    const boxSize = 16
    const spacing = 40
    
    // Public companies
    this.renderer.drawRoundedRect(x, y - boxSize / 2, boxSize, boxSize, brandConfig.borderRadius.sm, {
      fill: brandConfig.colors.primary[600],
    })
    
    this.renderer.drawText('Public Companies', x + boxSize + 8, y + 2, {
      fontSize: brandUtils.scaleFontSize(14, this.config.dimensions.width),
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral[300] : brandConfig.colors.foreground.secondary,
    })
    
    // Private companies
    const privateX = x + 150
    this.renderer.drawRoundedRect(privateX, y - boxSize / 2, boxSize, boxSize, brandConfig.borderRadius.sm, {
      fill: brandConfig.colors.accent.neon,
    })
    
    this.renderer.drawText('Private Companies', privateX + boxSize + 8, y + 2, {
      fontSize: brandUtils.scaleFontSize(14, this.config.dimensions.width),
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral[300] : brandConfig.colors.foreground.secondary,
    })
  }

  private drawInsights(sectors: Sector[], x: number, y: number) {
    const bgColor = this.config.theme === 'dark' 
      ? brandUtils.hexToRgba(brandConfig.colors.primary[800], 0.8)
      : brandUtils.hexToRgba(brandConfig.colors.neutral[50], 0.95)
    
    // Insights card
    this.renderer.drawRoundedRect(x, y, 320, 250, brandConfig.borderRadius.xl, {
      fill: bgColor,
      shadow: brandConfig.shadows.lg,
    })
    
    // Title
    this.renderer.drawText('Key Insights', x + 20, y + 30, {
      fontSize: brandUtils.scaleFontSize(18, this.config.dimensions.width),
      fontWeight: brandConfig.typography.fontWeight.semibold,
      color: this.config.theme === 'dark' ? brandConfig.colors.neutral.white : brandConfig.colors.foreground.primary,
    })
    
    // Calculate totals
    const totalPrivate = sectors.reduce((sum, s) => sum + this.getPrivateValuation(s), 0)
    const totalPublic = sectors.reduce((sum, s) => sum + this.getPublicMarketCap(s), 0)
    const avgPrivatePercentage = sectors.reduce((sum, s) => sum + s.privateMarketPercentage, 0) / sectors.length
    
    // Insights list
    const insights = [
      `Total Private Market: $${totalPrivate.toFixed(0)}B`,
      `Total Public Market: $${totalPublic.toFixed(0)}B`,
      `Avg. Private Share: ${avgPrivatePercentage.toFixed(0)}%`,
      `Opportunity Gap: $${(totalPrivate - totalPublic * 0.3).toFixed(0)}B`,
    ]
    
    insights.forEach((insight, index) => {
      const insightY = y + 65 + index * 35
      
      // Bullet point
      this.renderer.drawRoundedRect(x + 20, insightY - 4, 4, 4, 2, {
        fill: brandConfig.colors.accent.neon,
      })
      
      // Text
      this.renderer.drawText(insight, x + 35, insightY, {
        fontSize: brandUtils.scaleFontSize(14, this.config.dimensions.width),
        color: this.config.theme === 'dark' ? brandConfig.colors.neutral[200] : brandConfig.colors.foreground.secondary,
      })
    })
  }

  private getPublicMarketCap(sector: Sector): number {
    return sector.publicCompanies.reduce((sum, company) => sum + (company.marketCap || 0), 0)
  }

  private getPrivateValuation(sector: Sector): number {
    return sector.privateCompanies.reduce((sum, company) => sum + (company.valuation || 0), 0)
  }

  private getMaxMarketValue(sectors: Sector[]): number {
    return Math.max(
      ...sectors.map(s => Math.max(this.getPublicMarketCap(s), this.getPrivateValuation(s)))
    )
  }
}