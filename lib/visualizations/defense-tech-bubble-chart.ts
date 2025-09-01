import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface DefenseCompany {
  name: string
  value: number
  logo?: string
  brandColor?: string
  ticker?: string
}

interface Bubble {
  company: DefenseCompany
  x: number
  y: number
  r: number
  vx: number
  vy: number
  color: string
}

export class DefenseTechBubbleChartVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private ctx: CanvasRenderingContext2D
  private loadedLogos: Map<string, HTMLImageElement> = new Map()
  private equiamLogo: HTMLImageElement | null = null
  private publicBubbles: Bubble[] = []
  private privateBubbles: Bubble[] = []
  
  // Brand colors for Defense companies
  private brandColors: Record<string, string> = {
    // Public companies - Traditional defense contractors
    'RTX': '#000000',              // RTX black (matching space tech)
    'Boeing': '#0033A0',            // Boeing blue (matching space tech)
    'Lockheed Martin': '#002F6C',  // Lockheed navy (matching space tech)
    'Northrop Grumman': '#5B3C8D',  // Northrop purple (matching space tech)
    'General Dynamics': '#0055B7',  // GD blue (matching space tech)
    'BAE Systems': '#D40000',       // BAE red
    'L3Harris': '#FF6600',          // L3Harris orange (matching space tech)
    'Thales': '#6C2E84',            // Thales purple (matching space tech)
    'Honeywell': '#DE0031',         // Honeywell red
    'Leidos': '#7F47DD',            // Leidos purple
    'CACI': '#ED1C2E',              // CACI official red (not blue)
    'SAIC': '#0066B3',              // SAIC blue (not green)
    'Booz Allen': '#00C1D5',        // Booz Allen turquoise
    'Huntington Ingalls': '#00205B', // HII navy
    'Textron': '#003DA5',           // Textron blue
    'Elbit Systems': '#003F7F',     // Elbit darker blue
    'Leonardo': '#E4002B',          // Leonardo red
    'Rheinmetall': '#009FE3',       // Rheinmetall cyan
    'KBR': '#00568B',               // KBR Congress Blue
    'Palantir': '#000000',          // Palantir black
    
    // Private companies - Defense tech innovators
    'Anduril': '#1a1a1a',           // Anduril black
    'Shield AI': '#0066CC',         // Shield AI blue (keeping as is)
    'Applied Intuition': '#0080FF', // Applied Intuition lighter blue (from logo)
    'Saronic': '#00D4AA',           // Saronic teal (keeping as is)
    'Castelion': '#FF4500',         // Castelion orange-red (keeping as is)
    'Epirus': '#6B46C1',            // Epirus purple (keeping as is)
    'Hadrian': '#E60000',           // Hadrian red (from logo)
    'Vannevar Labs': '#003DA5',     // Vannevar dark blue
    'HawkEye360': '#FF6B35',        // HawkEye orange
    'Firestorm': '#DC143C',         // Firestorm crimson (keeping as is)
    'CHAOS Industries': '#4A4A4A',  // CHAOS gray
    'Primer': '#7C3AED',            // Primer purple (keeping as is)
    'Skydio': '#003D82',            // Skydio darker blue (from logo)
    'Fortem': '#6B46C1',            // Fortem purple
    'True Anomaly': '#FF1493',      // True Anomaly deep pink
    'Mach Industries': '#8B0000',   // Mach Industries dark red
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
    
    // Define companies with their data - August 2025 market caps/valuations
    const publicCompanies: DefenseCompany[] = [
      { name: 'Palantir', value: 368, ticker: 'PLTR', logo: 'palantir.png' },
      { name: 'RTX', value: 211, ticker: 'RTX', logo: 'rtx.png' },
      { name: 'Boeing', value: 177, ticker: 'BA', logo: 'boeing.png' },
      { name: 'Honeywell', value: 139, ticker: 'HON', logo: 'honeywell.png' },
      { name: 'Lockheed Martin', value: 106, ticker: 'LMT', logo: 'lockheed-martin.png' },
      { name: 'Rheinmetall', value: 90.5, ticker: 'ETR: RHM', logo: 'rheinmetall.png' },
      { name: 'General Dynamics', value: 87.4, ticker: 'GD', logo: 'general-dynamics.png' },
      { name: 'Northrop Grumman', value: 84, ticker: 'NOC', logo: 'northrop-grumman.png' },
      { name: 'BAE Systems', value: 70.4, ticker: 'LON: BA', logo: 'bae-systems.png' },
      { name: 'Thales', value: 54, ticker: 'HO.PA', logo: 'thales.png' },
      { name: 'L3Harris', value: 52, ticker: 'LHX', logo: 'l3harris.png' },
      { name: 'Leonardo', value: 33.1, ticker: 'BIT: LDO', logo: 'leonardo.png' },
      { name: 'Leidos', value: 23.5, ticker: 'LDOS', logo: 'leidos.png' },
      { name: 'Elbit Systems', value: 22.8, ticker: 'ESLT', logo: 'elbit-systems.png' },
      { name: 'Textron', value: 14.5, ticker: 'TXT', logo: 'textron.png' },
      { name: 'Booz Allen', value: 13.7, ticker: 'BAH', logo: 'booz-allen.png' },
      { name: 'CACI', value: 10.7, ticker: 'CACI', logo: 'caci.png' },
      { name: 'Huntington Ingalls', value: 10.6, ticker: 'HII', logo: 'huntington-ingalls.png' },
      { name: 'KBR', value: 6.5, ticker: 'KBR', logo: 'kbr.png' },
      { name: 'SAIC', value: 5.6, ticker: 'SAIC', logo: 'saic.png' },
    ]

    const privateCompanies: DefenseCompany[] = [
      { name: 'Anduril', value: 40, logo: 'anduril.png' },
      { name: 'Applied Intuition', value: 15, logo: 'applied-intuition.png' },
      { name: 'Shield AI', value: 5.5, logo: 'shield-ai.png' },
      { name: 'Saronic', value: 4, logo: 'saronic.png' },
      { name: 'Castelion', value: 2.5, logo: 'castelion.png' },
      { name: 'Skydio', value: 2.5, logo: 'skydio.png' },
      { name: 'CHAOS Industries', value: 2, logo: 'chaos-industries.png' },
      { name: 'Epirus', value: 1.1, logo: 'epirus.png' },
      { name: 'True Anomaly', value: 0.944, logo: 'true-anomaly.png' },
      { name: 'Vannevar Labs', value: 0.575, logo: 'vannevar-labs.png' },
      { name: 'Hadrian', value: 0.45, logo: 'hadrian.png' },
      { name: 'HawkEye360', value: 0.4, logo: 'hawkeye360.png' },
      { name: 'Mach Industries', value: 0.335, logo: 'mach-industries.png' },
      { name: 'Primer', value: 0.27, logo: 'primer.png' },
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
    this.renderer.drawText('DEFENSE TECH', padding, 100, {
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

  private initializeBubbles(publicCompanies: DefenseCompany[], privateCompanies: DefenseCompany[]) {
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
      // Special handling for wide/short logos
      let logoSizeMultiplier = 1.1
      if (company.name === 'Lockheed Martin' || company.name === 'General Dynamics') {
        logoSizeMultiplier = 1.4  // Allow wider logos for these companies
      }
      
      const logoMaxSize = r * logoSizeMultiplier
      const logoAspectRatio = logo.width / logo.height
      
      let logoWidth, logoHeight
      
      // Maintain aspect ratio
      if (logoAspectRatio > 1) {
        // Logo is wider than tall
        const widthMultiplier = (company.name === 'Lockheed Martin' || company.name === 'General Dynamics') ? 1.5 : 1.2
        logoWidth = Math.min(logoMaxSize, r * widthMultiplier)
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
      let logoYOffset = 0
      if (company.name === 'CACI' || company.name === 'Booz Allen') {
        logoYOffset = 10  // Shift up 10 pixels
      } else if (company.name === 'Castelion') {
        logoYOffset = 5  // Shift up 5 pixels
      }
      const logoY = y - r * 0.1 - logoHeight / 2 - logoYOffset
      
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
    
    // Use default color for all companies including Anduril
    const textColor = color
    
    this.renderer.drawText(displayValue, x, y + r * 0.35, {
      fontSize: valueFontSize,
      fontWeight: 800,  // BOLD like AI bubble chart
      color: textColor,
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
    
    // Pure defense exposure (from market_cap_attribution_by_sector.md calculations)
    const pureDefenseEstimate = 989 // Pre-calculated pure defense value from attribution analysis
    
    // PUBLIC COMPANIES - EXACT STYLING AS AI BUBBLE
    // Line 1: Total Market Cap: $1.6T | Pure Defense Value: $989B
    const publicLine1 = publicTotal >= 1000
      ? `Total Market Cap: $${(publicTotal/1000).toFixed(1)}T | Pure Defense Value: $${pureDefenseEstimate}B`
      : `Total Market Cap: $${publicTotal.toFixed(0)}B | Pure Defense Value: $${pureDefenseEstimate}B`
    
    this.renderer.drawText(publicLine1, padding + sectionWidth/2, totalsY, {
      fontSize: 36,  // SAME AS AI BUBBLE
      fontWeight: 800,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[900],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // Line 2: 2030 Projected defense value
    const projectedDefenseValue = pureDefenseEstimate * Math.pow(1.05, 5)  // 5% annual growth for legacy defense
    this.renderer.drawText(`2030 Defense Projected: $${(projectedDefenseValue/1000).toFixed(1)}T`, padding + sectionWidth/2, totalsY + 35, {
      fontSize: 32,  // SAME AS AI BUBBLE
      fontWeight: 700,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[600],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // PRIVATE COMPANIES - Pure defense tech
    this.renderer.drawText(`Total Valuation: $${privateTotal.toFixed(1)}B`, centerX + sectionWidth/2, totalsY, {
      fontSize: 36,  // SAME AS AI BUBBLE
      fontWeight: 800,  // SAME AS AI BUBBLE
      color: brandConfig.colors.primary[600],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // Private projection with higher growth rate (defense tech growing faster)
    const privateProjected = privateTotal * Math.pow(1.40, 5)  // 40% annual growth
    const privateProjectedText = privateProjected >= 1000 
      ? `2030 Projected: $${(privateProjected/1000).toFixed(1)}T`
      : `2030 Projected: $${privateProjected.toFixed(0)}B`
    
    this.renderer.drawText(privateProjectedText, centerX + sectionWidth/2, totalsY + 35, {
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

  private async preloadLogos(companies: DefenseCompany[]): Promise<void> {
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