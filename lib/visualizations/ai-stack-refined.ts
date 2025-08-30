import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface Company {
  name: string
  ticker?: string
  marketCap?: number
  valuation?: number
  logo: string
  growthRate?: string
  arr?: string
}

interface Layer {
  name: string
  description: string
  color: string
  publicCompanies: Company[]
  privateCompanies: Company[]
}

export class AIStackRefinedVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private theme: 'light' | 'dark'
  private loadedLogos: Map<string, HTMLImageElement> = new Map()
  private ctx: CanvasRenderingContext2D

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

  async render(stackData: any) {
    // Clean white background for clarity
    this.renderer.clear('#FFFFFF')
    
    // Draw header with key message
    this.drawHeader()
    
    // Draw the four layers with better spacing
    const layers = [
      {
        ...stackData.aiStack.applications,
        publicTotal: this.calculateTotal(stackData.aiStack.applications.publicCompanies),
        privateTotal: this.calculateTotal(stackData.aiStack.applications.privateCompanies)
      },
      {
        ...stackData.aiStack.models,
        publicTotal: this.calculateTotal(stackData.aiStack.models.publicCompanies),
        privateTotal: this.calculateTotal(stackData.aiStack.models.privateCompanies)
      },
      {
        ...stackData.aiStack.cloud,
        publicTotal: this.calculateTotal(stackData.aiStack.cloud.publicCompanies),
        privateTotal: this.calculateTotal(stackData.aiStack.cloud.privateCompanies)
      },
      {
        ...stackData.aiStack.infrastructure,
        publicTotal: this.calculateTotal(stackData.aiStack.infrastructure.publicCompanies),
        privateTotal: this.calculateTotal(stackData.aiStack.infrastructure.privateCompanies)
      }
    ]
    
    const layerHeight = 180
    const startY = 160
    const padding = 60
    
    // Preload logos
    await this.preloadLogos(stackData.aiStack)
    
    layers.forEach((layer, index) => {
      this.drawLayerRefined(layer, startY + index * layerHeight, layerHeight - 20, padding)
    })
    
    // Draw key insights panel with updated numbers
    this.drawInsightsPanel()
    
    // Add EQUIAM branding
    this.drawBranding()
  }

  private drawHeader() {
    const padding = 60
    
    // Main title - larger and bolder
    this.renderer.drawText('The AI Technology Stack: Public vs Private', padding, 60, {
      fontSize: 52,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: brandConfig.colors.primary[900],
    })
    
    // Key message
    this.renderer.drawText('OpenAI ($300B) and Anthropic ($170B) growing 1000%+ annually — could surpass NVIDIA within 3-10 years', padding, 100, {
      fontSize: 24,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 500,
      color: brandConfig.colors.accent.alert,
    })
    
    // Date stamp
    this.renderer.drawText('Market data as of August 25, 2025', padding, 130, {
      fontSize: 14,
      color: brandConfig.colors.foreground.tertiary,
    })
  }

  private drawLayerRefined(layer: any, y: number, height: number, padding: number) {
    const width = this.dimensions.width - padding * 2
    
    // Layer container with subtle background
    this.renderer.drawRoundedRect(padding, y, width, height, 12, {
      fill: '#FAFBFC',
      stroke: brandConfig.colors.neutral[200],
      strokeWidth: 1,
    })
    
    // Layer header bar with color
    this.renderer.drawRoundedRect(padding, y, width, 36, 12, {
      fill: brandUtils.hexToRgba(layer.color, 0.08),
    })
    
    // Layer name - bigger and clearer
    this.renderer.drawText(layer.name.toUpperCase(), padding + 24, y + 24, {
      fontSize: 16,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 700,
      color: layer.color,
      letterSpacing: 1,
    })
    
    // Value comparison on the right side of header
    const publicVal = this.formatValue(layer.publicTotal)
    const privateVal = this.formatValue(layer.privateTotal)
    
    this.renderer.drawText(`PUBLIC: $${publicVal}`, padding + width - 400, y + 24, {
      fontSize: 14,
      fontWeight: 600,
      color: brandConfig.colors.neutral[600],
    })
    
    this.renderer.drawText(`PRIVATE: $${privateVal}`, padding + width - 200, y + 24, {
      fontSize: 14,
      fontWeight: 600,
      color: brandConfig.colors.accent.neon,
    })
    
    // Split line - more prominent
    const splitX = padding + width * 0.5
    this.ctx.strokeStyle = brandConfig.colors.primary[200]
    this.ctx.lineWidth = 2
    this.ctx.beginPath()
    this.ctx.moveTo(splitX, y + 45)
    this.ctx.lineTo(splitX, y + height - 10)
    this.ctx.stroke()
    
    // Section labels
    this.renderer.drawText('PUBLIC COMPANIES', padding + 24, y + 55, {
      fontSize: 11,
      fontWeight: 700,
      color: brandConfig.colors.neutral[500],
      letterSpacing: 1,
    })
    
    this.renderer.drawText('PRIVATE COMPANIES', splitX + 24, y + 55, {
      fontSize: 11,
      fontWeight: 700,
      color: brandConfig.colors.accent.neon,
      letterSpacing: 1,
    })
    
    // Draw company logos and names - LARGER and CLEARER
    const logoSize = 48
    const spacing = 20
    const startYLogos = y + 75
    const maxPerRow = 5
    
    // Public companies
    this.drawCompaniesRefined(
      layer.publicCompanies.slice(0, 8),
      padding + 24,
      startYLogos,
      (splitX - padding - 48),
      logoSize,
      false
    )
    
    // Private companies
    this.drawCompaniesRefined(
      layer.privateCompanies.slice(0, 8),
      splitX + 24,
      startYLogos,
      (padding + width - splitX - 48),
      logoSize,
      true
    )
  }

  private drawCompaniesRefined(
    companies: Company[],
    x: number,
    y: number,
    maxWidth: number,
    logoSize: number,
    isPrivate: boolean
  ) {
    const itemWidth = 90 // Fixed width per company
    const itemsPerRow = Math.floor(maxWidth / itemWidth)
    
    companies.forEach((company, index) => {
      const row = Math.floor(index / itemsPerRow)
      const col = index % itemsPerRow
      const itemX = x + col * itemWidth
      const itemY = y + row * 70
      
      // Try to draw actual logo
      const logo = this.loadedLogos.get(company.name.toLowerCase())
      if (logo && logo.complete) {
        this.ctx.drawImage(logo, itemX, itemY, logoSize, logoSize)
      } else {
        // Fallback to styled initial
        this.renderer.drawRoundedRect(itemX, itemY, logoSize, logoSize, 8, {
          fill: isPrivate ? brandUtils.hexToRgba(brandConfig.colors.accent.neon, 0.1) : '#F5F5F5',
          stroke: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.neutral[300],
          strokeWidth: 1,
        })
        
        const initial = company.name.charAt(0)
        this.renderer.drawText(initial, itemX + logoSize/2, itemY + logoSize/2 + 6, {
          fontSize: 24,
          fontWeight: 700,
          color: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.neutral[600],
          align: 'center',
        })
      }
      
      // Company name - clearer
      const displayName = company.ticker || company.name.split(' ')[0]
      this.renderer.drawText(displayName, itemX + logoSize/2, itemY + logoSize + 14, {
        fontSize: 11,
        fontWeight: 600,
        color: brandConfig.colors.neutral[700],
        align: 'center',
      })
      
      // Valuation - more prominent
      const value = company.marketCap || company.valuation || 0
      let valueLabel = ''
      if (value >= 1000) {
        valueLabel = `$${(value/1000).toFixed(1)}T`
      } else if (value >= 1) {
        valueLabel = `$${value.toFixed(0)}B`
      }
      
      if (valueLabel) {
        this.renderer.drawText(valueLabel, itemX + logoSize/2, itemY + logoSize + 28, {
          fontSize: 12,
          fontWeight: 700,
          color: isPrivate ? brandConfig.colors.accent.neon : brandConfig.colors.primary[600],
          align: 'center',
        })
      }
      
      // Growth rate for key private companies
      if (isPrivate && company.growthRate) {
        this.renderer.drawText(company.growthRate, itemX + logoSize/2, itemY + logoSize + 42, {
          fontSize: 10,
          fontWeight: 500,
          color: brandConfig.colors.accent.neon,
          align: 'center',
          fontStyle: 'italic',
        })
      }
    })
  }

  private drawInsightsPanel() {
    const panelWidth = 500
    const panelHeight = 320
    const x = this.dimensions.width - panelWidth - 60
    const y = 180
    
    // Panel with strong border
    this.renderer.drawRoundedRect(x, y, panelWidth, panelHeight, 16, {
      fill: '#FFFFFF',
      stroke: brandConfig.colors.primary[600],
      strokeWidth: 2,
    })
    
    // Header background
    this.renderer.drawRoundedRect(x, y, panelWidth, 50, 16, {
      fill: brandConfig.colors.primary[600],
    })
    
    // Title
    this.renderer.drawText('THE OPPORTUNITY', x + 24, y + 32, {
      fontSize: 20,
      fontWeight: 700,
      color: '#FFFFFF',
      letterSpacing: 1,
    })
    
    // Key metrics with better layout
    const metrics = [
      { label: 'OpenAI Valuation', value: '$300B+', subtext: 'Path to $1T' },
      { label: 'Anthropic Valuation', value: '$170B', subtext: 'ARR: $1B → $5B in 7 months' },
      { label: 'Growth Rate', value: '1000%+', subtext: 'Unprecedented expansion' },
      { label: 'Time to Dominance', value: '3-10 Years', subtext: 'Could surpass NVIDIA' },
    ]
    
    metrics.forEach((metric, index) => {
      const metricY = y + 80 + index * 55
      
      this.renderer.drawText(metric.label, x + 24, metricY, {
        fontSize: 14,
        color: brandConfig.colors.neutral[600],
      })
      
      this.renderer.drawText(metric.value, x + 24, metricY + 20, {
        fontSize: 22,
        fontWeight: 700,
        color: brandConfig.colors.primary[600],
      })
      
      this.renderer.drawText(metric.subtext, x + 200, metricY + 20, {
        fontSize: 12,
        color: brandConfig.colors.neutral[500],
        fontStyle: 'italic',
      })
    })
    
    // Bottom message box
    this.renderer.drawRoundedRect(x + 16, y + panelHeight - 60, panelWidth - 32, 44, 8, {
      fill: brandUtils.hexToRgba(brandConfig.colors.accent.alert, 0.1),
    })
    
    this.renderer.drawText('Missing the next NVIDIA by ignoring private markets', x + 24, y + panelHeight - 35, {
      fontSize: 16,
      fontWeight: 600,
      color: brandConfig.colors.accent.alert,
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
    
    // Source attribution
    this.renderer.drawText('Source: Company filings, PitchBook, Crunchbase', 60, this.dimensions.height - 30, {
      fontSize: 11,
      color: brandConfig.colors.neutral[400],
    })
  }

  private async preloadLogos(stack: any): Promise<void> {
    const logoPromises: Promise<void>[] = []
    
    // Map of company names to logo files
    const logoMap: Record<string, string> = {
      'nvidia': 'nvidia.png',
      'anthropic': 'anthropic.png',
      'spacex': 'spacex.png',
      'stripe': 'stripe.png',
      'databricks': 'databricks.png',
      'canva': 'canva.png',
      'chime': 'chime.png',
      'plaid': 'plaid.png',
      'rippling': 'rippling.png',
      'snowflake': 'snowflake.png',
      'palantir': 'palantir.png',
      'coinbase': 'coinbase.png',
      'anduril': 'anduril.png',
      'coreweave': 'coreweave.png',
      'servicetitan': 'servicetitan.png',
      // Add more mappings as needed
    }
    
    // Load all logos
    Object.entries(logoMap).forEach(([key, filename]) => {
      const promise = new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          this.loadedLogos.set(key, img)
          resolve()
        }
        img.onerror = () => resolve() // Continue even if logo fails
        img.src = `/company-logos/${filename}`
      })
      logoPromises.push(promise)
    })
    
    await Promise.all(logoPromises)
  }

  private calculateTotal(companies: Company[]): number {
    return companies.reduce((sum, c) => sum + (c.marketCap || c.valuation || 0), 0)
  }

  private formatValue(value: number): string {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}T`
    }
    return `${value.toFixed(0)}B`
  }
}