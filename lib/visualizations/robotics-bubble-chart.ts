import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface RoboticsCompany {
  name: string
  value: number
  logo?: string
  brandColor?: string
  ticker?: string
}

interface Bubble {
  company: RoboticsCompany
  x: number
  y: number
  r: number
  vx: number
  vy: number
  color: string
}

export class RoboticsBubbleChartVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private ctx: CanvasRenderingContext2D
  private loadedLogos: Map<string, HTMLImageElement> = new Map()
  private equiamLogo: HTMLImageElement | null = null
  private publicBubbles: Bubble[] = []
  private privateBubbles: Bubble[] = []
  
  // Brand colors for Robotics companies
  private brandColors: Record<string, string> = {
    // Public companies
    'Intuitive Surgical': '#FF6600',  // Intuitive orange (from eye dot)
    'Keyence': '#DC143C',  // Keyence red (from K highlight)
    'ABB': '#FF000F',  // ABB red
    'Fanuc': '#B22222',  // Fanuc brick red
    'Rockwell Automation': '#CD202C',  // Rockwell red
    'Zebra Technologies': '#000000',  // Zebra black
    'Teradyne': '#0072CE',  // Teradyne blue
    'Yaskawa': '#003DA5',  // Yaskawa blue
    'Omron': '#0066B2',  // Omron blue
    'Cognex': '#009639',  // Cognex green
    'PROCEPT BioRobotics': '#00B4D8',  // PROCEPT cyan
    'Harmonic Drive': '#1E3A8A',  // Harmonic navy
    
    // Private companies
    'Skild AI': '#7ba79e',  // Updated seafoam green
    'Physical Intelligence': '#D2B48C',  // Beige/tan
    'Figure AI': '#ff8038',  // Updated orange
    'Apptronik': '#FF8C00',  // Orange
    'Agility Robotics': '#40E0D0',  // Turquoise
    'Carbon Robotics': '#CC5500',  // Dark orange-red (from C in logo)
    'Iron Ox': '#FF0000',  // Bright red
    'Canvas': '#F97316',  // Construction orange
    'Collaborative Robotics': '#00C853',  // Green
    'Zipline': '#E60000',  // Zipline red
  }

  constructor(
    renderer: CanvasRenderer,
    dimensions: { width: number; height: number }
  ) {
    this.renderer = renderer
    this.dimensions = dimensions
    this.ctx = (renderer as any).ctx
  }

  async render() {
    // Clean white background
    this.renderer.clear('#FFFFFF')
    
    // Load EQUIAM logo
    await this.loadEquiamLogo()
    
    // Draw header
    this.drawHeader()
    
    // Define companies with their data
    const publicCompanies: RoboticsCompany[] = [
      { name: 'Intuitive Surgical', value: 168, ticker: 'ISRG', logo: 'intuitive-surgical.png' },
      { name: 'Keyence', value: 93, ticker: '6861.T', logo: 'keyence.png' },
      { name: 'ABB', value: 122, ticker: 'ABB', logo: 'abb.png' },
      { name: 'Fanuc', value: 28, ticker: '6954.T', logo: 'fanuc.png' },
      { name: 'Rockwell Automation', value: 39, ticker: 'ROK', logo: 'rockwell-automation.png' },
      { name: 'Zebra Technologies', value: 16, ticker: 'ZBRA', logo: 'zebra-technologies.png' },
      { name: 'Teradyne', value: 19, ticker: 'TER', logo: 'teradyne.png' },
      { name: 'Yaskawa', value: 5.4, ticker: '6506.T', logo: 'yaskawa.png' },
      { name: 'Omron', value: 5.2, ticker: '6645.T', logo: 'omron.png' },
      { name: 'Cognex', value: 7.4, ticker: 'CGNX', logo: 'cognex.png' },
      { name: 'PROCEPT BioRobotics', value: 2.3, ticker: 'PRCT', logo: 'procept-biorobotics.png' },
      { name: 'Harmonic Drive', value: 1.7, ticker: 'TYO: 6324', logo: 'harmonic-drive.png' },
    ]

    const privateCompanies: RoboticsCompany[] = [
      { name: 'Figure AI', value: 39.5, logo: 'figure-ai.png' },
      { name: 'Zipline', value: 5.15, logo: 'zipline.png' },
      { name: 'Skild AI', value: 4.7, logo: 'skild-ai.png' },
      { name: 'Physical Intelligence', value: 2.4, logo: 'physical-intelligence.png' },
      { name: 'Agility Robotics', value: 2.15, logo: 'agility-robotics.png' },
      { name: 'Apptronik', value: 1.9, logo: 'apptronik.png' },
      { name: 'Collaborative Robotics', value: 0.46, logo: 'collaborative-robotics.png' },
      { name: 'Iron Ox', value: 0.3, logo: 'iron-ox.png' },
      { name: 'Carbon Robotics', value: 0.15, logo: 'carbon-robotics.png' },
      { name: 'Canvas', value: 0.08, logo: 'canvas.png' },
    ]
    
    // Assign brand colors
    publicCompanies.forEach(company => {
      company.brandColor = this.brandColors[company.name] || '#666666'
    })
    privateCompanies.forEach(company => {
      company.brandColor = this.brandColors[company.name] || '#666666'
    })
    
    // Preload logos
    await this.preloadLogos([...publicCompanies, ...privateCompanies])
    
    // Initialize bubbles with logarithmic scaling
    this.initializeBubbles(publicCompanies, privateCompanies)
    
    // Run force simulation
    this.runForceSimulation()
    
    // Draw section headers
    this.drawSectionHeaders()
    
    // Draw center divider
    this.drawCenterDivider()
    
    // Draw the bubble charts
    this.drawBubbles()
    
    // Draw scaling footnotes
    this.drawScalingFootnotes()
    
    // Draw footer with totals
    this.drawFooter()
  }

  private drawHeader() {
    const padding = 80
    
    // Title
    this.renderer.drawText('ROBOTICS', padding, 100, {
      fontSize: 96,
      fontFamily: brandConfig.typography.fontFamily.display,
      fontWeight: 800,
      color: brandConfig.colors.primary[900],
    })
    
    // Subtitle
    this.renderer.drawText('Publicly traded firms vs. Private firms (August 2025)', padding, 160, {
      fontSize: 36,
      fontFamily: brandConfig.typography.fontFamily.body,
      fontWeight: 400,
      color: brandConfig.colors.foreground.secondary,
    })
    
    // Draw EQUIAM logo in top right
    if (this.equiamLogo && this.equiamLogo.complete) {
      const logoHeight = 60
      const aspectRatio = this.equiamLogo.width / this.equiamLogo.height
      const logoWidth = logoHeight * aspectRatio
      
      this.ctx.drawImage(
        this.equiamLogo,
        this.dimensions.width - padding - logoWidth,
        80,
        logoWidth,
        logoHeight
      )
    } else {
      // Fallback: Draw EQUIAM text if logo doesn't load
      this.renderer.drawText('EQUIAM', this.dimensions.width - padding - 100, 100, {
        fontSize: 32,
        fontWeight: 800,
        color: brandConfig.colors.primary[600],
        align: 'right',
        fontFamily: brandConfig.typography.fontFamily.display,
      })
    }
  }

  private drawSectionHeaders() {
    const startY = 240  // EXACT SAME AS AI BUBBLE
    const padding = 60  // EXACT SAME AS AI BUBBLE
    const centerX = this.dimensions.width / 2
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    
    // PUBLIC COMPANIES header - EXACT SAME AS AI BUBBLE
    this.renderer.drawText('PUBLIC COMPANIES', centerX - sectionWidth/2, startY, {
      fontSize: 36,
      fontWeight: 700,
      color: brandConfig.colors.neutral[800],
      align: 'center',
      letterSpacing: 2,
    })
    
    // PRIVATE COMPANIES header - EXACT SAME AS AI BUBBLE
    this.renderer.drawText('PRIVATE COMPANIES', centerX + sectionWidth/2, startY, {
      fontSize: 36,
      fontWeight: 700,
      color: brandConfig.colors.primary[600],
      align: 'center',
      letterSpacing: 2,
    })
  }

  private drawCenterDivider() {
    const centerX = this.dimensions.width / 2
    const startY = 290
    const endY = this.dimensions.height - 180
    
    this.ctx.strokeStyle = brandConfig.colors.neutral[200]
    this.ctx.lineWidth = 1
    this.ctx.beginPath()
    this.ctx.moveTo(centerX, startY)
    this.ctx.lineTo(centerX, endY)
    this.ctx.stroke()
  }

  private initializeBubbles(publicCompanies: RoboticsCompany[], privateCompanies: RoboticsCompany[]) {
    const centerX = this.dimensions.width / 2
    const padding = 60
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    
    // Section boundaries
    const publicCenterX = padding + sectionWidth / 2
    const privateCenterX = centerX + dividerMargin + sectionWidth / 2
    const sectionCenterY = 560  // Center position for optimal spacing
    
    // LOGARITHMIC SCALING with different max sizes for each section
    const minRadius = 50  // Keep minimum size for readability
    const maxRadiusPublic = 135  // Slightly reduced for public companies
    const maxRadiusPrivate = 150  // Full size for private companies
    
    // Calculate log ranges for each section
    const publicMin = Math.min(...publicCompanies.map(c => c.value))
    const publicMax = Math.max(...publicCompanies.map(c => c.value))
    const publicLogMin = Math.log10(publicMin)
    const publicLogMax = Math.log10(publicMax)
    
    const privateMin = Math.min(...privateCompanies.map(c => c.value))
    const privateMax = Math.max(...privateCompanies.map(c => c.value))
    const privateLogMin = Math.log10(privateMin)
    const privateLogMax = Math.log10(privateMax)
    
    // Sort companies by size for better packing (largest first)
    const sortedPublic = [...publicCompanies].sort((a, b) => b.value - a.value)
    
    // Initialize public bubbles with smart placement
    this.publicBubbles = sortedPublic.map((company, index) => {
      const logValue = Math.log10(company.value)
      const normalizedLog = (logValue - publicLogMin) / (publicLogMax - publicLogMin)
      
      // Logarithmic scaling with power adjustment for better differentiation
      const radius = minRadius + Math.pow(normalizedLog, 0.7) * (maxRadiusPublic - minRadius)
      
      // Smart initial placement based on size
      let x, y
      if (index < 3) {
        // Largest 3 bubbles start near center
        const angle = index * 2.0944 // 120 degrees apart
        x = publicCenterX + Math.cos(angle) * 30
        y = sectionCenterY + Math.sin(angle) * 30
      } else if (index < 8) {
        // Medium bubbles in second ring
        const angle = (index - 3) * 1.2566 // 72 degrees apart
        x = publicCenterX + Math.cos(angle) * 80
        y = sectionCenterY + Math.sin(angle) * 60
      } else {
        // Small bubbles start at edges to fill gaps
        const angle = index * 2.39996
        const edgeDistance = 120 + (index - 8) * 15
        x = publicCenterX + Math.cos(angle) * edgeDistance
        y = sectionCenterY + Math.sin(angle) * edgeDistance * 0.7 // Flatten vertically
      }
      
      return {
        company,
        x,
        y,
        r: radius,
        vx: 0,
        vy: 0,
        color: company.brandColor || '#666666'
      }
    })
    
    // Sort companies by size for better packing (largest first)
    const sortedPrivate = [...privateCompanies].sort((a, b) => b.value - a.value)
    
    // Initialize private bubbles with smart placement
    this.privateBubbles = sortedPrivate.map((company, index) => {
      const logValue = Math.log10(company.value)
      const normalizedLog = (logValue - privateLogMin) / (privateLogMax - privateLogMin)
      
      // Logarithmic scaling with power adjustment - using full size for private
      const radius = minRadius + Math.pow(normalizedLog, 0.7) * (maxRadiusPrivate - minRadius)
      
      // Smart initial placement based on size
      let x, y
      if (index < 3) {
        // Largest 3 bubbles start near center
        const angle = index * 2.0944 // 120 degrees apart
        x = privateCenterX + Math.cos(angle) * 30
        y = sectionCenterY + Math.sin(angle) * 30
      } else if (index < 8) {
        // Medium bubbles in second ring
        const angle = (index - 3) * 1.2566 // 72 degrees apart
        x = privateCenterX + Math.cos(angle) * 80
        y = sectionCenterY + Math.sin(angle) * 60
      } else {
        // Small bubbles start at edges to fill gaps
        const angle = index * 2.39996
        const edgeDistance = 120 + (index - 8) * 15
        x = privateCenterX + Math.cos(angle) * edgeDistance
        y = sectionCenterY + Math.sin(angle) * edgeDistance * 0.7
      }
      
      return {
        company,
        x,
        y,
        r: radius,
        vx: 0,
        vy: 0,
        color: company.brandColor || '#666666'
      }
    })
    
    // Sort by size for better layering
    this.publicBubbles.sort((a, b) => b.r - a.r)
    this.privateBubbles.sort((a, b) => b.r - a.r)
  }

  private runForceSimulation() {
    const centerX = this.dimensions.width / 2
    const padding = 60
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    
    // Section centers
    const publicCenterX = padding + sectionWidth / 2
    const privateCenterX = centerX + dividerMargin + sectionWidth / 2
    const sectionCenterY = 560
    
    // Boundaries - use more vertical space
    const topBound = 320  // Space from top
    const bottomBound = this.dimensions.height - 120  // Use more bottom space
    
    const iterations = 800  // More iterations for complex packing
    const bubblePadding = 6  // More padding to reduce overlap
    const attractionStrength = 0.015 // Gentler attraction - let small bubbles find gaps
    const repulsionStrength = 1.0 // Strong repulsion to prevent overlap
    
    // Simulate public bubbles with improved packing
    for (let iter = 0; iter < iterations; iter++) {
      const alpha = 1 - (iter / iterations)
      const coolingFactor = alpha // Normal cooling
      
      for (let i = 0; i < this.publicBubbles.length; i++) {
        const bubble = this.publicBubbles[i]
        
        // STRONG centering force for tight grouping
        const dx = publicCenterX - bubble.x
        const dy = sectionCenterY - bubble.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Always apply center gravity
        if (distance > 0) {
          const force = attractionStrength * alpha
          bubble.vx += (dx / distance) * force * distance / 100 // Stronger pull for distant bubbles
          bubble.vy += (dy / distance) * force * distance / 100
        }
        
        // Improved collision detection with all other bubbles
        for (let j = 0; j < this.publicBubbles.length; j++) {
          if (i === j) continue
          
          const other = this.publicBubbles[j]
          const dx = other.x - bubble.x
          const dy = other.y - bubble.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = bubble.r + other.r + bubblePadding
          
          if (distance < minDistance && distance > 0.01) {
            // MODERATE repulsion - just enough to minimize overlap
            const overlap = minDistance - distance
            const force = (overlap / minDistance) * repulsionStrength * alpha
            const fx = (dx / distance) * force * 0.5
            const fy = (dy / distance) * force * 0.5
            
            bubble.vx -= fx
            bubble.vy -= fy
            if (j > i) { // Only apply to other bubble once
              other.vx += fx
              other.vy += fy
            }
          }
        }
        
        // Apply velocity with higher damping for smoother settling
        const damping = 0.9
        bubble.vx *= damping
        bubble.vy *= damping
        bubble.x += bubble.vx
        bubble.y += bubble.vy
        
        // Keep within section bounds - softer top boundary to prevent compression
        const leftBound = padding + bubble.r
        const rightBound = centerX - dividerMargin - bubble.r
        bubble.x = Math.max(leftBound, Math.min(rightBound, bubble.x))
        
        // Softer vertical bounds - push back gently when hitting top
        if (bubble.y - bubble.r < topBound) {
          bubble.y = topBound + bubble.r
          bubble.vy = Math.abs(bubble.vy) * 0.3  // Gentle bounce to prevent stacking
        }
        if (bubble.y + bubble.r > bottomBound) {
          bubble.y = bottomBound - bubble.r
          bubble.vy = -Math.abs(bubble.vy) * 0.3
        }
      }
    }
    
    // Simulate private bubbles with improved packing
    for (let iter = 0; iter < iterations; iter++) {
      const alpha = 1 - (iter / iterations)
      const coolingFactor = alpha // Normal cooling
      
      for (let i = 0; i < this.privateBubbles.length; i++) {
        const bubble = this.privateBubbles[i]
        
        // STRONG centering force for tight grouping
        const dx = privateCenterX - bubble.x
        const dy = sectionCenterY - bubble.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Always apply center gravity
        if (distance > 0) {
          const force = attractionStrength * alpha
          bubble.vx += (dx / distance) * force * distance / 100 // Stronger pull for distant bubbles
          bubble.vy += (dy / distance) * force * distance / 100
        }
        
        // Improved collision detection with all other bubbles
        for (let j = 0; j < this.privateBubbles.length; j++) {
          if (i === j) continue
          
          const other = this.privateBubbles[j]
          const dx = other.x - bubble.x
          const dy = other.y - bubble.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = bubble.r + other.r + bubblePadding
          
          if (distance < minDistance && distance > 0.01) {
            // MODERATE repulsion - just enough to minimize overlap
            const overlap = minDistance - distance
            const force = (overlap / minDistance) * repulsionStrength * alpha
            const fx = (dx / distance) * force * 0.5
            const fy = (dy / distance) * force * 0.5
            
            bubble.vx -= fx
            bubble.vy -= fy
            if (j > i) { // Only apply to other bubble once
              other.vx += fx
              other.vy += fy
            }
          }
        }
        
        // Apply velocity with higher damping for smoother settling
        const damping = 0.9
        bubble.vx *= damping
        bubble.vy *= damping
        bubble.x += bubble.vx
        bubble.y += bubble.vy
        
        // Keep within section bounds - softer top boundary to prevent compression
        const leftBound = centerX + dividerMargin + bubble.r
        const rightBound = this.dimensions.width - padding - bubble.r
        bubble.x = Math.max(leftBound, Math.min(rightBound, bubble.x))
        
        // Softer vertical bounds - push back gently when hitting top
        if (bubble.y - bubble.r < topBound) {
          bubble.y = topBound + bubble.r
          bubble.vy = Math.abs(bubble.vy) * 0.3  // Gentle bounce to prevent stacking
        }
        if (bubble.y + bubble.r > bottomBound) {
          bubble.y = bottomBound - bubble.r
          bubble.vy = -Math.abs(bubble.vy) * 0.3
        }
      }
    }
  }

  private drawBubbles() {
    // Draw all bubbles
    [...this.publicBubbles, ...this.privateBubbles].forEach(bubble => {
      this.drawBubble(bubble)
    })
  }

  private drawBubble(bubble: Bubble) {
    const { x, y, r, company, color } = bubble
    
    // Draw semi-transparent colored bubble - MATCH AI BUBBLE CHART EXACTLY
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, brandUtils.hexToRgba(color, 0.08))  // 8% opacity at center (3D effect)
    gradient.addColorStop(0.6, brandUtils.hexToRgba(color, 0.12))  // 12% opacity midway
    gradient.addColorStop(1, brandUtils.hexToRgba(color, 0.20))  // 20% opacity at edge
    
    this.ctx.fillStyle = gradient
    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0, Math.PI * 2)
    this.ctx.fill()
    
    // Draw subtle border - only stroke once!
    if (!company.ticker) {  // Private companies get glow effect
      this.ctx.shadowColor = color
      this.ctx.shadowBlur = 8
      this.ctx.strokeStyle = brandUtils.hexToRgba(color, 0.25)  // Keep same opacity
      this.ctx.lineWidth = 1.5
      this.ctx.stroke()
      this.ctx.shadowBlur = 0  // Reset shadow
    } else {  // Public companies - no glow
      this.ctx.strokeStyle = brandUtils.hexToRgba(color, 0.25)
      this.ctx.lineWidth = 1.5
      this.ctx.stroke()
    }
    
    // Draw logo if available
    const logo = this.loadedLogos.get(company.name)
    if (logo && logo.complete) {
      // Calculate logo size to fit nicely within bubble - MAINTAIN ASPECT RATIO
      // Special handling for specific companies with tall logos
      let logoSizeMultiplier = 1.1
      if (company.name === 'Iron Ox' || company.name === '1X Technologies') {
        logoSizeMultiplier = 0.7  // Further reduce size for these specific logos
      }
      
      const logoMaxSize = r * logoSizeMultiplier
      const logoAspectRatio = logo.width / logo.height
      
      let logoWidth, logoHeight
      
      // Maintain aspect ratio
      if (logoAspectRatio > 1) {
        // Logo is wider than tall
        logoWidth = Math.min(logoMaxSize, r * 1.2)
        logoHeight = logoWidth / logoAspectRatio
      } else {
        // Logo is taller than wide or square
        logoHeight = Math.min(logoMaxSize, r * 1.2)
        logoWidth = logoHeight * logoAspectRatio
      }
      
      // Save context for clipping
      this.ctx.save()
      
      // Create circular clipping mask
      this.ctx.beginPath()
      this.ctx.arc(x, y - r * 0.1, r * 0.8, 0, Math.PI * 2)
      this.ctx.clip()
      
      // Draw logo centered with proper aspect ratio
      const logoX = x - logoWidth / 2
      // Special vertical adjustments for specific logos
      let logoY = y - r * 0.1 - logoHeight / 2
      if (company.name === 'Iron Ox') {
        logoY -= 9  // Shift Iron Ox logo 9 pixels higher total
      } else if (company.name === 'Harmonic Drive') {
        logoY -= 10  // Shift Harmonic Drive logo 10 pixels higher
      }
      
      this.ctx.drawImage(
        logo,
        logoX,
        logoY,
        logoWidth,
        logoHeight
      )
      
      // Restore context
      this.ctx.restore()
    } else {
      // Fallback: draw company name
      const fontSize = Math.max(12, r * 0.25)
      this.renderer.drawText(company.name, x, y - r * 0.2, {
        fontSize,
        fontWeight: 600,
        color: brandConfig.colors.neutral[800],
        align: 'center',
        fontFamily: brandConfig.typography.fontFamily.display,
      })
    }
    
    // Draw value below logo/name - no decimals for >$9.9B
    const value = company.value
    const displayValue = value >= 1000 
      ? `$${(value/1000).toFixed(1)}T`
      : value >= 10
      ? `$${Math.round(value)}B`  // No decimals for $10B+
      : value >= 1
      ? `$${value.toFixed(1)}B`  // Show decimal for <$10B
      : `$${Math.round(value * 1000)}M`  // Show as millions <$1B
    
    // Dynamic font size based on bubble radius - MATCH AI BUBBLE CHART
    const valueFontSize = Math.max(16, Math.min(28, r * 0.25))
    
    this.renderer.drawText(displayValue, x, y + r * 0.35, {
      fontSize: valueFontSize,
      fontWeight: 800,  // BOLD like AI bubble chart
      color: color,  // Use company brand color
      align: 'center',
    })
  }

  private drawScalingFootnotes() {
    // EXACT SAME AS AI BUBBLE CHART POSITIONING
    const centerX = this.dimensions.width / 2
    const padding = 60
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    const footnoteY = this.dimensions.height - 140  // SAME AS AI BUBBLE
    
    // Calculate ranges
    const publicMin = Math.min(...this.publicBubbles.map(b => b.company.value))
    const publicMax = Math.max(...this.publicBubbles.map(b => b.company.value))
    const privateMin = Math.min(...this.privateBubbles.map(b => b.company.value))
    const privateMax = Math.max(...this.privateBubbles.map(b => b.company.value))
    
    // Public footnote with numerical details - EXACT POSITIONING AS AI BUBBLE
    const publicText = `Bubble size: log scale, $${publicMin.toFixed(1)}B to $${publicMax.toFixed(0)}B mapped to area`
    this.renderer.drawText(publicText, padding + sectionWidth/2, footnoteY, {
      fontSize: 14,
      fontWeight: 400,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[500],
      align: 'center',
      fontStyle: 'italic',
    })
    
    // Private footnote with numerical details - EXACT POSITIONING AS AI BUBBLE
    const privateText = `Bubble size: log scale, $${privateMin.toFixed(2)}B to $${privateMax.toFixed(1)}B mapped to area`
    this.renderer.drawText(privateText, centerX + sectionWidth/2, footnoteY, {  // FIXED - no dividerMargin here!
      fontSize: 14,
      fontWeight: 400,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[500],
      align: 'center',
      fontStyle: 'italic',
    })
  }

  private drawFooter() {
    // EXACT SAME POSITIONING AS AI BUBBLE CHART
    const padding = 80  // SAME AS AI BUBBLE
    const centerX = this.dimensions.width / 2
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    const totalsY = this.dimensions.height - 60  // SAME AS AI BUBBLE
    
    // Calculate totals
    const publicTotal = this.publicBubbles.reduce((sum, b) => sum + b.company.value, 0)
    const privateTotal = this.privateBubbles.reduce((sum, b) => sum + b.company.value, 0)
    
    // Pure robotics exposure (from market_cap_attribution_by_sector.md)
    const pureRoboticsEstimate = 408 // Pre-calculated pure robotics value from attribution analysis
    
    // PUBLIC COMPANIES - EXACT STYLING AS AI BUBBLE
    // Line 1: Total Market Cap: $507B | Pure Robotics Value: $408B
    const publicLine1 = publicTotal >= 1000
      ? `Total Market Cap: $${(publicTotal/1000).toFixed(0)}T | Pure Robotics Value: $${pureRoboticsEstimate}B`
      : `Total Market Cap: $${publicTotal.toFixed(0)}B | Pure Robotics Value: $${pureRoboticsEstimate}B`
    
    this.renderer.drawText(publicLine1, padding + sectionWidth/2, totalsY, {
      fontSize: 36,  // SAME AS AI BUBBLE
      fontWeight: 800,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[900],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // Line 2: 2030 Projected: $1.4T
    this.renderer.drawText('2030 Projected: $1.4T', padding + sectionWidth/2, totalsY + 35, {
      fontSize: 32,  // SAME AS AI BUBBLE
      fontWeight: 700,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[600],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // PRIVATE COMPANIES - EXACT STYLING AS AI BUBBLE
    // Line 1: Total Valuation: $15B
    this.renderer.drawText(`Total Valuation: $${privateTotal.toFixed(0)}B`, centerX + sectionWidth/2, totalsY, {
      fontSize: 36,  // SAME AS AI BUBBLE
      fontWeight: 800,  // SAME AS AI BUBBLE
      color: brandConfig.colors.primary[600],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // Line 2: 2030 Projected: $120B - EXACT COLOR FROM AI BUBBLE
    this.renderer.drawText('2030 Projected: $120B', centerX + sectionWidth/2, totalsY + 35, {
      fontSize: 32,  // SAME AS AI BUBBLE
      fontWeight: 700,  // SAME AS AI BUBBLE
      color: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.9),  // EXACT SAME AS AI BUBBLE - 90% opacity
      align: 'center',
    })
    
    // NO SOURCE NOTE - Logo at top is sufficient
  }

  private async loadEquiamLogo() {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.equiamLogo = img
        resolve()
      }
      img.onerror = () => {
        console.warn('Could not load EQUIAM logo')
        resolve()
      }
      img.src = '/equiam_logos/EQUIAM_two_color_horizontal.png'  // EXACT PATH FROM AI BUBBLE CHART
    })
  }

  private async preloadLogos(companies: RoboticsCompany[]): Promise<void> {
    const logoPromises: Promise<void>[] = []
    
    companies.forEach((company) => {
      if (company.logo) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            this.loadedLogos.set(company.name, img)
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