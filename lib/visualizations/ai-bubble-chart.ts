import { CanvasRenderer } from '../canvas-utils'
import { brandConfig, brandUtils } from '../brand-config'

interface AICompany {
  name: string
  value: number  // Market cap or valuation in billions
  logo?: string
  isPublic: boolean
  brandColor?: string  // Company's brand color
}

interface Bubble {
  company: AICompany
  x: number
  y: number
  r: number  // radius
  vx: number  // velocity x
  vy: number  // velocity y
  color: string
}

export class AIBubbleChartVisualization {
  private renderer: CanvasRenderer
  private dimensions: { width: number; height: number }
  private ctx: CanvasRenderingContext2D
  private loadedLogos: Map<string, HTMLImageElement> = new Map()
  private equiamLogo: HTMLImageElement | null = null
  private publicBubbles: Bubble[] = []
  private privateBubbles: Bubble[] = []
  
  // Brand colors for each company
  private brandColors: Record<string, string> = {
    // Public companies
    'nvidia': '#76B900',           // NVIDIA green
    'microsoft': '#0078D4',         // Microsoft blue
    'apple': '#555555',             // Apple gray
    'google': '#4285F4',            // Google blue
    'amazon': '#FF9900',            // Amazon orange
    'meta': '#0668E1',              // Meta blue
    'broadcom': '#CC0000',          // Broadcom red
    'tesla': '#E82127',             // Tesla red
    'oracle': '#F80000',            // Oracle red
    'palantir': '#000000',          // Palantir black
    'amd': '#808080',               // AMD gray (similar to palantir)
    'servicenow': '#99c4b1',        // ServiceNow updated green
    'applovin': '#00A8E1',          // AppLovin blue
    'snowflake': '#29B5E8',         // Snowflake cyan
    'coreweave': '#4e8cbd',         // CoreWeave updated blue
    'datadog': '#632CA6',           // Datadog purple
    'astera labs': '#5b96ca',       // Astera Labs updated blue
    'tempus': '#657da7',            // Tempus updated blue-gray
    'c3.ai': '#00A4E4',             // C3.ai blue
    
    // Private companies
    'openai': '#1a1a1a',            // OpenAI like palantir
    'anthropic': '#d97757',         // Anthropic updated orange
    'databricks': '#FF3621',        // Databricks red
    'ssi': '#0a0a0a',               // SSI darker than palantir
    'perplexity': '#86c1d1',        // Perplexity updated cyan
    'thinking machines': '#C0C0C0', // Thinking machines light gray/beige
    'midjourney': '#061434',        // Midjourney dark blue
    'anysphere': '#475935',         // Anysphere updated olive green
    'glean': '#575cf1',             // Glean updated purple
    'mistral': '#F97316',           // Mistral orange
    'cohere': '#224438',            // Cohere updated dark green
    'sambanova': '#e9b289',         // SambaNova updated beige
    'harvey': '#808080',            // Harvey gray like AMD
    'hugging face': '#FFD21F',      // Hugging Face yellow
    'cerebras': '#ec8d6a',          // Cerebras updated orange
    'openevidence': '#ea5327',      // OpenEvidence updated red-orange
    'elevenlabs': '#446efb',        // ElevenLabs updated blue
    'groq': '#F55036',              // Groq updated red
    'lovable': '#EC4899',           // Lovable pink
    'runway': '#000000',            // Runway black
    'together ai': '#4A90E2',       // Together AI blue
    'reka ai': '#7B68EE',           // Reka AI purple
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
    
    // Define companies with current market data
    const publicCompanies: AICompany[] = [
      { name: 'NVIDIA', value: 4280, isPublic: true, logo: 'nvidia.png' },
      { name: 'Microsoft', value: 3740, isPublic: true, logo: 'microsoft.png' },
      { name: 'Apple', value: 3410, isPublic: true, logo: 'apple.png' },
      { name: 'Google', value: 2530, isPublic: true, logo: 'google.png' },
      { name: 'Amazon', value: 2420, isPublic: true, logo: 'amazon.png' },
      { name: 'Meta', value: 1850, isPublic: true, logo: 'meta.png' },
      { name: 'Broadcom', value: 1360, isPublic: true, logo: 'broadcom.png' },
      { name: 'Tesla', value: 1050, isPublic: true, logo: 'tesla.png' },
      { name: 'Oracle', value: 623, isPublic: true, logo: 'oracle.png' },
      { name: 'Palantir', value: 368, isPublic: true, logo: 'palantir.png' },
      { name: 'AMD', value: 261, isPublic: true, logo: 'amd.png' },
      { name: 'ServiceNow', value: 182, isPublic: true, logo: 'servicenow.png' },
      { name: 'AppLovin', value: 154, isPublic: true, logo: 'applovin.png' },
      { name: 'Snowflake', value: 66, isPublic: true, logo: 'snowflake.png' },
      { name: 'CoreWeave', value: 47, isPublic: true, logo: 'coreweave.png' },
      { name: 'Datadog', value: 45, isPublic: true, logo: 'datadog.png' },
      { name: 'Astera Labs', value: 29, isPublic: true, logo: 'astera-labs.png' },
      { name: 'Tempus', value: 13.1, isPublic: true, logo: 'tempus.png' },
      { name: 'C3.ai', value: 2.3, isPublic: true, logo: 'c3ai.png' },
    ]

    const privateCompanies: AICompany[] = [
      { name: 'OpenAI', value: 400, isPublic: false, logo: 'openai.png' },
      { name: 'Anthropic', value: 170, isPublic: false, logo: 'anthropic.png' },
      { name: 'Databricks', value: 100, isPublic: false, logo: 'databricks.png' },
      { name: 'SSI', value: 32, isPublic: false, logo: 'ssi.png' },
      { name: 'Perplexity', value: 20, isPublic: false, logo: 'perplexity.png' },
      { name: 'Thinking Machines', value: 10, isPublic: false, logo: 'thinking-machines.png' },
      { name: 'Midjourney', value: 10, isPublic: false, logo: 'midjourney.png' },
      { name: 'Anysphere', value: 9.9, isPublic: false, logo: 'anysphere.png' },
      { name: 'Glean', value: 7.2, isPublic: false, logo: 'glean.png' },
      { name: 'Cohere', value: 6.8, isPublic: false, logo: 'cohere.png' },
      { name: 'Mistral', value: 6.5, isPublic: false, logo: 'mistral.png' },
      { name: 'SambaNova', value: 5.1, isPublic: false, logo: 'sambanova.png' },
      { name: 'Harvey', value: 5, isPublic: false, logo: 'harvey.png' },
      { name: 'Hugging Face', value: 4.5, isPublic: false, logo: 'hugging-face.png' },
      { name: 'Cerebras', value: 4.1, isPublic: false, logo: 'cerebras.png' },
      { name: 'Runway', value: 3.55, isPublic: false, logo: 'runway.png' },
      { name: 'OpenEvidence', value: 3.5, isPublic: false, logo: 'openevidence.png' },
      { name: 'Together AI', value: 3.3, isPublic: false, logo: 'together-ai.png' },
      { name: 'ElevenLabs', value: 3.3, isPublic: false, logo: 'elevenlabs.png' },
      { name: 'Groq', value: 2.8, isPublic: false, logo: 'groq.png' },
      { name: 'Lovable', value: 1.8, isPublic: false, logo: 'lovable.png' },
      { name: 'Reka AI', value: 1.0, isPublic: false, logo: 'reka-ai.png' },
    ]
    
    // Add brand colors to companies
    publicCompanies.forEach(company => {
      const colorKey = company.name.toLowerCase()
      company.brandColor = this.brandColors[colorKey] || '#666666'
    })
    
    privateCompanies.forEach(company => {
      const colorKey = company.name.toLowerCase()
      company.brandColor = this.brandColors[colorKey] || '#666666'
    })
    
    // Preload logos
    await this.preloadLogos([...publicCompanies, ...privateCompanies])
    
    // Initialize bubbles with logarithmic scaling
    this.initializeBubbles(publicCompanies, privateCompanies)
    
    // Run force simulation with NO OVERLAPPING
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
    
    // Title - matching AI Simple Logos
    this.renderer.drawText('AI', padding, 100, {
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
    
    // Draw EQUIAM logo
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
    }
  }

  private drawSectionHeaders() {
    const startY = 240
    const padding = 60
    const centerX = this.dimensions.width / 2
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    
    // PUBLIC COMPANIES header
    this.renderer.drawText('PUBLIC COMPANIES', centerX - sectionWidth/2, startY, {
      fontSize: 36,
      fontWeight: 700,
      color: brandConfig.colors.neutral[800],
      align: 'center',
      letterSpacing: 2,
    })
    
    // PRIVATE COMPANIES header
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

  private drawScalingFootnotes() {
    const centerX = this.dimensions.width / 2
    const padding = 60
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    const footnoteY = this.dimensions.height - 140
    
    // Calculate actual scaling ranges for transparency
    const publicMin = 2.3  // C3.ai at $2.3B
    const publicMax = 4400  // NVIDIA at $4.4T
    const privateMin = 1.5  // Runway at $1.5B
    const privateMax = 500  // OpenAI at $500B
    
    // Public footnote with range
    this.renderer.drawText(`Bubble size: log scale, $${publicMin}B to $${(publicMax/1000).toFixed(1)}T mapped to area`, padding + sectionWidth/2, footnoteY, {
      fontSize: 14,
      fontWeight: 400,
      color: brandConfig.colors.neutral[500],
      align: 'center',
      fontStyle: 'italic',
    })
    
    // Private footnote with range
    this.renderer.drawText(`Bubble size: log scale, $${privateMin}B to $${privateMax}B mapped to area`, centerX + sectionWidth/2, footnoteY, {
      fontSize: 14,
      fontWeight: 400,
      color: brandConfig.colors.neutral[500],
      align: 'center',
      fontStyle: 'italic',
    })
  }

  private initializeBubbles(publicCompanies: AICompany[], privateCompanies: AICompany[]) {
    const centerX = this.dimensions.width / 2
    const padding = 60
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    
    // Section boundaries
    const publicCenterX = padding + sectionWidth / 2
    const privateCenterX = centerX + dividerMargin + sectionWidth / 2
    const sectionCenterY = 560  // Slightly lower to use bottom space better
    
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
    const sectionCenterY = 480
    
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
      const coolingFactor = Math.max(0.3, alpha)
      
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
    const allBubbles = [...this.publicBubbles, ...this.privateBubbles]
    
    // Sort by radius for proper layering (largest first)
    allBubbles.sort((a, b) => b.r - a.r)
    
    for (const bubble of allBubbles) {
      this.drawBubble(bubble)
    }
  }

  private drawBubble(bubble: Bubble) {
    const { company, x, y, r, color } = bubble
    
    // Draw colored bubble background with brand color
    this.ctx.save()
    
    // Create circular clipping path
    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0, Math.PI * 2)
    this.ctx.closePath()
    
    // Fill with semi-transparent brand color
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, brandUtils.hexToRgba(color, 0.08))
    gradient.addColorStop(0.6, brandUtils.hexToRgba(color, 0.12))
    gradient.addColorStop(1, brandUtils.hexToRgba(color, 0.20))
    
    this.ctx.fillStyle = gradient
    this.ctx.fill()
    
    // Add subtle border - only stroke once!
    if (!company.isPublic) {  // Private companies get glow effect
      this.ctx.shadowColor = color
      this.ctx.shadowBlur = 8
      this.ctx.strokeStyle = brandUtils.hexToRgba(color, 0.25)  // Keep same opacity
      this.ctx.lineWidth = 1.5
      this.ctx.stroke()
      this.ctx.shadowBlur = 0
    } else {  // Public companies - no glow
      this.ctx.strokeStyle = brandUtils.hexToRgba(color, 0.25)
      this.ctx.lineWidth = 1.5
      this.ctx.stroke()
    }
    
    this.ctx.clip()
    
    // Draw logo if available
    const logo = this.loadedLogos.get(company.name.toLowerCase().replace(/\s/g, ''))
    if (logo && logo.complete) {
      // Calculate logo size to fit nicely within bubble
      const logoMaxSize = r * 1.1
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
      
      const logoX = x - logoWidth / 2
      // Shift Thinking Machines logo up by 5 pixels
      const logoYOffset = company.name.toLowerCase() === 'thinking machines' ? 5 : 0
      const logoY = y - logoHeight / 2 - r * 0.1 - logoYOffset
      
      this.ctx.globalAlpha = 0.8
      this.ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)
      this.ctx.globalAlpha = 1.0
    } else {
      // Fallback: Company initial
      this.renderer.drawText(company.name.charAt(0), x, y - r * 0.1, {
        fontSize: r * 0.5,
        fontWeight: 700,
        color: brandUtils.hexToRgba(color, 0.6),
        align: 'center',
      })
    }
    
    this.ctx.restore()
    
    // Draw value text below logo (inside bubble)
    // Format value with no decimals for >$9.9B
    const valueText = company.value >= 1000 
      ? `$${(company.value/1000).toFixed(1)}T`
      : company.value >= 10
      ? `$${Math.round(company.value)}B`  // No decimals for $10B+
      : company.value >= 1
      ? `$${company.value.toFixed(1)}B`  // Show decimal for <$10B
      : `$${Math.round(company.value * 1000)}M`  // Show as millions <$1B
    
    // Dynamic font size based on bubble radius
    const fontSize = Math.max(16, Math.min(28, r * 0.25))
    
    // Use black text for gray bubble companies (AMD, Harvey) and darker text for Thinking Machines
    let textColor = color
    if (['amd', 'harvey'].includes(company.name.toLowerCase())) {
      textColor = '#000000'
    } else if (company.name.toLowerCase() === 'thinking machines') {
      textColor = '#606060'  // Darker gray for better readability
    }
    
    this.renderer.drawText(valueText, x, y + r * 0.35, {
      fontSize,
      fontWeight: 800,
      color: textColor,
      align: 'center',
    })
  }

  private drawFooter() {
    const padding = 80
    const centerX = this.dimensions.width / 2
    const dividerMargin = 30
    const sectionWidth = centerX - padding - dividerMargin
    const totalsY = this.dimensions.height - 60
    
    // Calculate totals
    const publicTotal = this.publicBubbles.reduce((sum, b) => sum + b.company.value, 0)
    const privateTotal = this.privateBubbles.reduce((sum, b) => sum + b.company.value, 0)
    
    // PUBLIC SIDE - Exactly matching AI Simple Logos format
    const pureAIEstimate = publicTotal * 0.4
    const publicLine1 = `Total Market Cap: $${(publicTotal/1000).toFixed(2)}T | Pure AI Value: $${(pureAIEstimate/1000).toFixed(1)}T`
    
    this.renderer.drawText(publicLine1, padding + sectionWidth/2, totalsY, {
      fontSize: 36,
      fontWeight: 800,
      color: brandConfig.colors.neutral[900],
      align: 'center',
    })
    
    // 2030 projection for public
    const yearsToProject = 5
    const publicAIProjected = pureAIEstimate * Math.pow(1.175, yearsToProject)
    const publicLine2 = `2030 Projected AI Value: $${(publicAIProjected/1000).toFixed(1)}T`
    
    this.renderer.drawText(publicLine2, padding + sectionWidth/2, totalsY + 35, {
      fontSize: 32,
      fontWeight: 700,
      color: brandConfig.colors.neutral[600],
      align: 'center',
    })
    
    // PRIVATE SIDE
    const privateTotalText = privateTotal >= 1000 
      ? `Total Valuation: $${(privateTotal/1000).toFixed(2)}T`
      : `Total Valuation: $${privateTotal.toFixed(0)}B`
    
    this.renderer.drawText(privateTotalText, centerX + sectionWidth/2, totalsY, {
      fontSize: 36,
      fontWeight: 800,
      color: brandConfig.colors.primary[600],
      align: 'center',
    })
    
    // Private projection
    const privateProjected = privateTotal * Math.pow(1.35, yearsToProject)
    const privateProjectedText = privateProjected >= 1000 
      ? `2030 Projected: $${(privateProjected/1000).toFixed(1)}T`
      : `2030 Projected: $${privateProjected.toFixed(0)}B`
    
    this.renderer.drawText(privateProjectedText, centerX + sectionWidth/2, totalsY + 35, {
      fontSize: 32,
      fontWeight: 700,
      color: brandUtils.hexToRgba(brandConfig.colors.primary[600], 0.9),
      align: 'center',
    })
  }

  private async preloadLogos(companies: AICompany[]): Promise<void> {
    const logoPromises: Promise<void>[] = []
    
    companies.forEach((company) => {
      if (company.logo) {
        const promise = new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => {
            const key = company.name.toLowerCase().replace(/\s/g, '')
            this.loadedLogos.set(key, img)
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

  private async loadEquiamLogo(): Promise<void> {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => {
        this.equiamLogo = img
        resolve()
      }
      img.onerror = () => {
        console.error('Failed to load EQUIAM logo')
        resolve()
      }
      img.src = '/equiam_logos/EQUIAM_two_color_horizontal.png'
    })
  }
}