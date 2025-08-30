import { brandConfig, brandUtils } from './brand-config'
import { Company, Sector, CanvasContext2D } from '@/types'

export class CanvasRenderer {
  private ctx: CanvasContext2D
  private width: number
  private height: number

  constructor(ctx: CanvasContext2D, width: number, height: number) {
    this.ctx = ctx
    this.width = width
    this.height = height
    this.setupCanvas()
  }

  private setupCanvas() {
    // Set up high-quality rendering
    this.ctx.imageSmoothingEnabled = true
    this.ctx.imageSmoothingQuality = 'high'
  }

  // Clear canvas with background color
  clear(color: string = brandConfig.colors.background.primary) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  // Draw text with brand typography
  drawText(
    text: string,
    x: number,
    y: number,
    options: {
      fontSize?: number
      fontWeight?: number
      fontFamily?: string
      color?: string
      align?: CanvasTextAlign
      baseline?: CanvasTextBaseline
      maxWidth?: number
    } = {}
  ) {
    const {
      fontSize = brandConfig.typography.fontSize.body,
      fontWeight = brandConfig.typography.fontWeight.book,
      fontFamily = brandConfig.typography.fontFamily.body,
      color = brandConfig.colors.foreground.primary,
      align = 'left',
      baseline = 'alphabetic',
      maxWidth,
    } = options

    this.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    this.ctx.fillStyle = color
    this.ctx.textAlign = align
    this.ctx.textBaseline = baseline

    if (maxWidth) {
      this.ctx.fillText(text, x, y, maxWidth)
    } else {
      this.ctx.fillText(text, x, y)
    }
  }

  // Draw rounded rectangle
  drawRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number = brandConfig.borderRadius.md,
    options: {
      fill?: string
      stroke?: string
      strokeWidth?: number
      shadow?: typeof brandConfig.shadows.md
    } = {}
  ) {
    const { fill, stroke, strokeWidth = 1, shadow } = options

    // Apply shadow if provided
    if (shadow) {
      this.ctx.shadowColor = shadow.color
      this.ctx.shadowBlur = shadow.blur
      this.ctx.shadowOffsetY = shadow.offsetY
    }

    this.ctx.beginPath()
    this.ctx.moveTo(x + radius, y)
    this.ctx.lineTo(x + width - radius, y)
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    this.ctx.lineTo(x + width, y + height - radius)
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    this.ctx.lineTo(x + radius, y + height)
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    this.ctx.lineTo(x, y + radius)
    this.ctx.quadraticCurveTo(x, y, x + radius, y)
    this.ctx.closePath()

    if (fill) {
      this.ctx.fillStyle = fill
      this.ctx.fill()
    }

    if (stroke) {
      this.ctx.strokeStyle = stroke
      this.ctx.lineWidth = strokeWidth
      this.ctx.stroke()
    }

    // Reset shadow
    this.ctx.shadowColor = 'transparent'
    this.ctx.shadowBlur = 0
    this.ctx.shadowOffsetX = 0
    this.ctx.shadowOffsetY = 0
  }

  // Draw gradient background
  drawGradientBackground(
    colors: string[],
    direction: 'vertical' | 'horizontal' | 'diagonal' = 'vertical'
  ) {
    let gradient: CanvasGradient

    switch (direction) {
      case 'horizontal':
        gradient = this.ctx.createLinearGradient(0, 0, this.width, 0)
        break
      case 'diagonal':
        gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height)
        break
      default: // vertical
        gradient = this.ctx.createLinearGradient(0, 0, 0, this.height)
    }

    colors.forEach((color, index) => {
      gradient.addColorStop(index / (colors.length - 1), color)
    })

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.width, this.height)
  }

  // Draw company card
  drawCompanyCard(
    company: Company,
    x: number,
    y: number,
    width: number,
    height: number,
    isHighlighted: boolean = false
  ) {
    // Card background
    const bgColor = isHighlighted
      ? brandUtils.hexToRgba(brandConfig.colors.primary[100], 0.1)
      : brandConfig.colors.neutral[50]

    this.drawRoundedRect(x, y, width, height, brandConfig.borderRadius.lg, {
      fill: bgColor,
      stroke: isHighlighted ? brandConfig.colors.primary[400] : brandConfig.colors.neutral[200],
      strokeWidth: isHighlighted ? 2 : 1,
      shadow: brandConfig.shadows.sm,
    })

    // Company name
    const fontSize = brandUtils.scaleFontSize(16, this.width)
    this.drawText(company.name, x + 16, y + 24, {
      fontSize,
      fontWeight: brandConfig.typography.fontWeight.semibold,
      color: brandConfig.colors.foreground.primary,
    })

    // Ticker or status
    if (company.ticker) {
      this.drawText(company.ticker, x + 16, y + 48, {
        fontSize: fontSize * 0.75,
        color: brandConfig.colors.foreground.secondary,
      })
    } else {
      this.drawText('Private', x + 16, y + 48, {
        fontSize: fontSize * 0.75,
        color: brandConfig.colors.accent.neon,
        fontWeight: brandConfig.typography.fontWeight.medium,
      })
    }

    // Market cap or valuation
    const value = company.isPublic ? company.marketCap : company.valuation
    if (value) {
      this.drawText(`$${value.toFixed(1)}B`, x + width - 16, y + 24, {
        fontSize,
        fontWeight: brandConfig.typography.fontWeight.bold,
        color: brandConfig.colors.primary[600],
        align: 'right',
      })
    }

    // Growth rate
    if (company.growthRate) {
      const growthColor = company.growthRate > 0 
        ? brandConfig.colors.accent.neon 
        : brandConfig.colors.accent.alert
      
      this.drawText(`${company.growthRate > 0 ? '+' : ''}${company.growthRate}%`, x + width - 16, y + 48, {
        fontSize: fontSize * 0.75,
        color: growthColor,
        align: 'right',
      })
    }
  }

  // Draw progress bar
  drawProgressBar(
    x: number,
    y: number,
    width: number,
    height: number,
    progress: number, // 0-1
    options: {
      backgroundColor?: string
      progressColor?: string
      showLabel?: boolean
      label?: string
    } = {}
  ) {
    const {
      backgroundColor = brandConfig.colors.neutral[200],
      progressColor = brandConfig.colors.primary[600],
      showLabel = false,
      label,
    } = options

    // Background
    this.drawRoundedRect(x, y, width, height, height / 2, {
      fill: backgroundColor,
    })

    // Progress
    const progressWidth = width * progress
    if (progressWidth > 0) {
      this.drawRoundedRect(x, y, progressWidth, height, height / 2, {
        fill: progressColor,
      })
    }

    // Label
    if (showLabel && label) {
      this.drawText(label, x + width / 2, y + height / 2, {
        fontSize: height * 0.6,
        color: brandConfig.colors.foreground.primary,
        align: 'center',
        baseline: 'middle',
      })
    }
  }

  // Draw chart
  drawBarChart(
    data: { label: string; value: number; color?: string }[],
    x: number,
    y: number,
    width: number,
    height: number,
    options: {
      showLabels?: boolean
      showValues?: boolean
      barSpacing?: number
    } = {}
  ) {
    const { showLabels = true, showValues = true, barSpacing = 8 } = options

    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = (width - barSpacing * (data.length - 1)) / data.length

    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * height
      const barX = x + index * (barWidth + barSpacing)
      const barY = y + height - barHeight

      // Draw bar
      this.drawRoundedRect(barX, barY, barWidth, barHeight, brandConfig.borderRadius.sm, {
        fill: item.color || brandConfig.colors.primary[600],
      })

      // Draw value
      if (showValues) {
        this.drawText(item.value.toString(), barX + barWidth / 2, barY - 8, {
          fontSize: 14,
          align: 'center',
          color: brandConfig.colors.foreground.secondary,
        })
      }

      // Draw label
      if (showLabels) {
        this.drawText(item.label, barX + barWidth / 2, y + height + 20, {
          fontSize: 12,
          align: 'center',
          color: brandConfig.colors.foreground.secondary,
        })
      }
    })
  }

  // Draw watermark
  drawWatermark(text: string = 'EQUIAM', opacity: number = 0.1) {
    const fontSize = this.width * 0.03
    this.ctx.save()
    this.ctx.globalAlpha = opacity
    this.drawText(text, this.width - 20, this.height - 20, {
      fontSize,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: brandConfig.typography.fontWeight.bold,
      color: brandConfig.colors.primary[600],
      align: 'right',
      baseline: 'bottom',
    })
    this.ctx.restore()
  }

  // Get canvas as data URL
  toDataURL(type: string = 'image/png', quality: number = 1): string {
    return this.ctx.canvas.toDataURL(type, quality)
  }

  // Get canvas as blob
  toBlob(callback: (blob: Blob | null) => void, type: string = 'image/png', quality: number = 1) {
    this.ctx.canvas.toBlob(callback, type, quality)
  }
}