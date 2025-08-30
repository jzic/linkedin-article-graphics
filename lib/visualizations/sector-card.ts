import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'
import { Sector, VisualizationConfig } from '@/types'

export class SectorCardVisualization {
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
        'diagonal'
      )
    } else {
      this.renderer.clear(brandConfig.colors.background.tertiary)
    }

    // Calculate layout
    const padding = brandConfig.spacing.xl
    const cardSpacing = brandConfig.spacing.md
    const headerHeight = 120
    
    // Draw header
    this.drawHeader()

    // Draw sectors
    const cardsPerRow = Math.min(sectors.length, 3)
    const cardWidth = (dimensions.width - padding * 2 - cardSpacing * (cardsPerRow - 1)) / cardsPerRow
    const cardHeight = 400

    sectors.forEach((sector, index) => {
      const row = Math.floor(index / cardsPerRow)
      const col = index % cardsPerRow
      const x = padding + col * (cardWidth + cardSpacing)
      const y = headerHeight + padding + row * (cardHeight + cardSpacing)
      
      this.drawSectorCard(sector, x, y, cardWidth, cardHeight)
    })

    // Draw footer/watermark
    if (this.config.showWatermark) {
      this.renderer.drawWatermark()
    }
  }

  private drawHeader() {
    const { dimensions, title, subtitle } = this.config
    const padding = brandConfig.spacing.xl
    
    // Title
    if (title) {
      this.renderer.drawText(title, padding, padding + 40, {
        fontSize: brandUtils.scaleFontSize(brandConfig.typography.fontSize.h2, dimensions.width),
        fontFamily: brandConfig.typography.fontFamily.display,
        fontWeight: brandConfig.typography.fontWeight.bold,
        color: brandConfig.colors.foreground.primary,
      })
    }

    // Subtitle
    if (subtitle) {
      this.renderer.drawText(subtitle, padding, padding + 80, {
        fontSize: brandUtils.scaleFontSize(brandConfig.typography.fontSize.bodyLarge, dimensions.width),
        color: brandConfig.colors.foreground.secondary,
      })
    }
  }

  private drawSectorCard(sector: Sector, x: number, y: number, width: number, height: number) {
    // Card background with sector color accent
    this.renderer.drawRoundedRect(x, y, width, height, brandConfig.borderRadius.xl, {
      fill: brandConfig.colors.neutral.white,
      shadow: brandConfig.shadows.lg,
    })

    // Color accent bar
    const accentHeight = 4
    this.renderer.drawRoundedRect(x, y, width, accentHeight, 0, {
      fill: sector.color || brandConfig.colors.primary[600],
    })

    // Sector name
    const contentPadding = brandConfig.spacing.md
    this.renderer.drawText(sector.name, x + contentPadding, y + contentPadding + 20, {
      fontSize: brandUtils.scaleFontSize(24, this.config.dimensions.width),
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: brandConfig.typography.fontWeight.semibold,
      color: brandConfig.colors.foreground.primary,
    })

    // Market size
    this.renderer.drawText(`Total Market: $${sector.totalMarketSize}B`, x + contentPadding, y + contentPadding + 50, {
      fontSize: brandUtils.scaleFontSize(16, this.config.dimensions.width),
      color: brandConfig.colors.foreground.secondary,
    })

    // Private market percentage with visual indicator
    const privatePercentage = sector.privateMarketPercentage / 100
    const barY = y + contentPadding + 80
    const barWidth = width - contentPadding * 2
    const barHeight = 24

    // Background bar
    this.renderer.drawRoundedRect(x + contentPadding, barY, barWidth, barHeight, barHeight / 2, {
      fill: brandConfig.colors.neutral[200],
    })

    // Private market portion
    this.renderer.drawRoundedRect(x + contentPadding, barY, barWidth * privatePercentage, barHeight, barHeight / 2, {
      fill: brandConfig.colors.accent.neon,
    })

    // Percentage label
    this.renderer.drawText(`${sector.privateMarketPercentage}% Private Market`, x + width / 2, barY + barHeight / 2, {
      fontSize: brandUtils.scaleFontSize(14, this.config.dimensions.width),
      fontWeight: brandConfig.typography.fontWeight.medium,
      color: brandConfig.colors.foreground.primary,
      align: 'center',
      baseline: 'middle',
    })

    // Companies section
    const companiesY = barY + barHeight + brandConfig.spacing.lg
    
    // Public companies
    this.drawCompanySection(
      'Public Companies',
      sector.publicCompanies.slice(0, 3),
      x + contentPadding,
      companiesY,
      (width - contentPadding * 3) / 2,
      false
    )

    // Private companies
    this.drawCompanySection(
      'Private Companies',
      sector.privateCompanies.slice(0, 3),
      x + width / 2 + contentPadding / 2,
      companiesY,
      (width - contentPadding * 3) / 2,
      true
    )

    // Growth rate indicator
    if (sector.averageGrowthRate) {
      const growthY = y + height - contentPadding - 30
      this.renderer.drawText(`Avg. Growth Rate`, x + contentPadding, growthY, {
        fontSize: brandUtils.scaleFontSize(12, this.config.dimensions.width),
        color: brandConfig.colors.foreground.tertiary,
      })
      
      this.renderer.drawText(`${sector.averageGrowthRate}%`, x + contentPadding, growthY + 18, {
        fontSize: brandUtils.scaleFontSize(20, this.config.dimensions.width),
        fontWeight: brandConfig.typography.fontWeight.bold,
        color: brandConfig.colors.accent.neon,
      })
    }
  }

  private drawCompanySection(
    title: string,
    companies: any[],
    x: number,
    y: number,
    width: number,
    isPrivate: boolean
  ) {
    // Section title
    this.renderer.drawText(title, x, y, {
      fontSize: brandUtils.scaleFontSize(14, this.config.dimensions.width),
      fontWeight: brandConfig.typography.fontWeight.medium,
      color: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.primary[600],
    })

    // Company list
    companies.forEach((company, index) => {
      const companyY = y + 25 + index * 22
      
      // Company name
      this.renderer.drawText(company.name, x, companyY, {
        fontSize: brandUtils.scaleFontSize(12, this.config.dimensions.width),
        color: brandConfig.colors.foreground.primary,
        maxWidth: width - 50,
      })

      // Value
      const value = company.marketCap || company.valuation
      if (value) {
        this.renderer.drawText(`$${value.toFixed(1)}B`, x + width, companyY, {
          fontSize: brandUtils.scaleFontSize(12, this.config.dimensions.width),
          color: brandConfig.colors.foreground.secondary,
          align: 'right',
        })
      }
    })

    // Show more indicator if there are more companies
    const totalCompanies = isPrivate ? 
      this.config.sectors[0].privateCompanies.length : 
      this.config.sectors[0].publicCompanies.length
    
    if (totalCompanies > 3) {
      this.renderer.drawText(`+${totalCompanies - 3} more`, x, y + 25 + 3 * 22, {
        fontSize: brandUtils.scaleFontSize(11, this.config.dimensions.width),
        color: brandConfig.colors.foreground.tertiary,
        fontStyle: 'italic',
      })
    }
  }
}