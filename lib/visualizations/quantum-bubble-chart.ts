import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface QuantumCompany {
  name: string
  value: number
  logo?: string
  brandColor?: string
  ticker?: string
}

interface Bubble {
  company: QuantumCompany
  x: number
  y: number
  r: number
  vx: number
  vy: number
  color: string
}

export class QuantumBubbleChartVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private ctx: CanvasRenderingContext2D
  private loadedLogos: Map<string, HTMLImageElement> = new Map()
  private equiamLogo: HTMLImageElement | null = null
  private publicBubbles: Bubble[] = []
  private privateBubbles: Bubble[] = []
  
  // Brand colors for Quantum companies
  private brandColors: Record<string, string> = {
    // Public companies - Mix of pure-play and tech giants
    'IBM': '#0062FF',              // IBM blue
    'Google': '#4285F4',            // Google blue
    'Microsoft': '#0078D4',         // Microsoft blue
    'Amazon': '#FF9900',            // Amazon orange
    'Intel': '#0071C5',             // Intel blue
    'Honeywell': '#DE0031',         // Honeywell red
    'IonQ': '#FF5000',              // IonQ orange
    'Rigetti': '#00B5AD',           // Rigetti teal
    'D-Wave': '#00B4D8',            // D-Wave bright cyan
    'Quantum Computing Inc': '#211D53', // QCI dark purple
    'Arqit Quantum': '#050057',     // Arqit deep purple
    'Nvidia': '#76B900',            // Nvidia green
    
    // Private companies - Quantum innovators
    'PsiQuantum': '#1C1C1C',        // PsiQuantum dark gray
    'Atom Computing': '#FF6600',     // Atom orange
    'Alice & Bob': '#FFD700',       // Alice & Bob yellow
    'Oxford Quantum Circuits': '#002147', // OQC oxford blue
    'Quantum Machines': '#0066FF',  // QM blue
    'Pasqal': '#00C887',            // Pasqal green
    'Nord Quantique': '#DC2626',    // Nord red
    'Xanadu': '#4054C7',            // Xanadu blue
    'QuEra': '#4B2CBD',             // QuEra purple
    'Universal Quantum': '#FF1493',  // Universal pink
    'Quantum Motion': '#FF4342',    // Quantum Motion red
    'SandboxAQ': '#FFC107',         // Sandbox yellow/gold
    'Q-CTRL': '#7B3FF2',            // Q-CTRL purple
    'Classiq': '#4169E1',           // Classiq royal blue
    'Infleqtion': '#00C8FF',        // Infleqtion cyan
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
    const publicCompanies: QuantumCompany[] = [
      // Tech giants with quantum divisions (using fraction of market cap)
      { name: 'IBM', value: 180, ticker: 'IBM', logo: 'ibm.png' },  // Full market cap, significant quantum
      { name: 'Google', value: 2500, ticker: 'GOOGL', logo: 'google.png' },  // Alphabet market cap
      { name: 'Microsoft', value: 3900, ticker: 'MSFT', logo: 'microsoft.png' },  // Microsoft market cap
      { name: 'Amazon', value: 2500, ticker: 'AMZN', logo: 'amazon.png' },  // Amazon market cap
      { name: 'Intel', value: 140, ticker: 'INTC', logo: 'intel.png' },  // Intel market cap
      { name: 'Honeywell', value: 147, ticker: 'HON', logo: 'honeywell.png' },  // Honeywell market cap
      { name: 'Nvidia', value: 4400, ticker: 'NVDA', logo: 'nvidia.png' },  // Nvidia market cap
      
      // Pure-play quantum companies
      { name: 'IonQ', value: 6.4, ticker: 'IONQ', logo: 'ionq.png' },
      { name: 'Rigetti', value: 3.5, ticker: 'RGTI', logo: 'rigetti.png' },
      { name: 'D-Wave', value: 4.5, ticker: 'QBTS', logo: 'd-wave.png' },
      { name: 'Quantum Computing Inc', value: 0.8, ticker: 'QUBT', logo: 'quantum-computing-inc.png' },
      { name: 'Arqit Quantum', value: 0.15, ticker: 'ARQQ', logo: 'arqit.png' },
    ]

    const privateCompanies: QuantumCompany[] = [
      // Note: Quantinuum removed - majority owned by Honeywell (52-54%)
      { name: 'PsiQuantum', value: 6, logo: 'psiquantum.png' },  // $6B valuation, independent
      { name: 'Atom Computing', value: 1.2, logo: 'atom-computing.png' },
      { name: 'Alice & Bob', value: 0.35, logo: 'alice-bob.png' },  // €300-400M
      { name: 'Oxford Quantum Circuits', value: 0.65, logo: 'oxford-quantum-circuits.png' },
      { name: 'Quantum Machines', value: 0.5, logo: 'quantum-machines.png' },
      { name: 'Pasqal', value: 0.45, logo: 'pasqal.png' },
      { name: 'Nord Quantique', value: 0.024, logo: 'nord-quantique.png' },
      { name: 'Xanadu', value: 1, logo: 'xanadu.png' },
      { name: 'QuEra', value: 1, logo: 'quera.png' },
      { name: 'Universal Quantum', value: 0.3, logo: 'universal-quantum.png' },
      { name: 'Quantum Motion', value: 0.25, logo: 'quantum-motion.png' },
      { name: 'SandboxAQ', value: 0.5, logo: 'sandboxaq.png' },
      { name: 'Q-CTRL', value: 0.2, logo: 'q-ctrl.png' },
      { name: 'Classiq', value: 0.15, logo: 'classiq.png' },
      { name: 'Infleqtion', value: 0.8, logo: 'infleqtion.png' },  // Independent, $311M raised
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
    this.renderer.drawText('QUANTUM COMPUTING', padding, 100, {
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

  private initializeBubbles(publicCompanies: QuantumCompany[], privateCompanies: QuantumCompany[]) {
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
      let logoY = y - r * 0.1 - logoHeight / 2
      
      // Special positioning adjustments for specific companies
      if (company.name === 'Cisco') {
        logoY -= 8  // Shift Cisco logo up 8 pixels
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
    const publicText = `Bubble size: log scale, $${publicMin.toFixed(2)}B to $${(publicMax/1000).toFixed(1)}T mapped to area`
    this.renderer.drawText(publicText, padding + sectionWidth/2, footnoteY, {
      fontSize: 14,
      fontWeight: 400,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[500],
      align: 'center',
      fontStyle: 'italic',
    })
    
    // Private footnote with numerical details - EXACT POSITIONING AS AI BUBBLE
    const privateText = `Bubble size: log scale, $${privateMin.toFixed(3)}B to $${privateMax.toFixed(0)}B mapped to area`
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
    
    // Calculate pure-play quantum totals (excluding tech giants)
    const purePlayPublic = this.publicBubbles
      .filter(b => ['IonQ', 'Rigetti', 'D-Wave', 'Quantum Computing Inc', 'Arqit Quantum'].includes(b.company.name))
      .reduce((sum, b) => sum + b.company.value, 0)
    
    // PUBLIC COMPANIES - Show both total and pure-play
    const publicLine1 = `Total Market Cap: $${(publicTotal/1000).toFixed(1)}T | Pure Quantum: $${purePlayPublic.toFixed(1)}B`
    
    this.renderer.drawText(publicLine1, padding + sectionWidth/2, totalsY, {
      fontSize: 36,  // SAME AS AI BUBBLE
      fontWeight: 800,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[900],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // Line 2: 2030 Projected for pure-play quantum
    const projectedPurePlay = purePlayPublic * Math.pow(2.5, 5)  // 150% annual growth for quantum
    this.renderer.drawText(`2030 Pure Quantum Projected: $${projectedPurePlay.toFixed(0)}B`, padding + sectionWidth/2, totalsY + 35, {
      fontSize: 32,  // SAME AS AI BUBBLE
      fontWeight: 700,  // SAME AS AI BUBBLE
      color: brandConfig.colors.neutral[600],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // PRIVATE COMPANIES - Pure quantum tech
    this.renderer.drawText(`Total Valuation: $${privateTotal.toFixed(1)}B`, centerX + sectionWidth/2, totalsY, {
      fontSize: 36,  // SAME AS AI BUBBLE
      fontWeight: 800,  // SAME AS AI BUBBLE
      color: brandConfig.colors.primary[600],  // SAME AS AI BUBBLE
      align: 'center',
    })
    
    // Private projection with extreme growth rate (quantum is early stage)
    const privateProjected = privateTotal * Math.pow(2, 5)  // 100% annual growth (doubling)
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

  private async preloadLogos(companies: QuantumCompany[]): Promise<void> {
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