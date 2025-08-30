export interface Company {
  name: string
  logo?: string // URL or base64
  marketCap: number // in billions
  valuation?: number // for private companies, in billions
  growthRate?: number // YoY percentage
  isPublic: boolean
  ticker?: string
  founded?: number
  description?: string
  sector?: string
  subsector?: string
}

export interface Sector {
  id: string
  name: string
  description?: string
  publicCompanies: Company[]
  privateCompanies: Company[]
  totalMarketSize: number // in billions
  privateMarketPercentage: number
  averageGrowthRate?: number
  keyTrends?: string[]
  color?: string // Brand color for this sector
}

export interface VisualizationConfig {
  type: 'sector-card' | 'comparison-chart' | 'growth-trajectory' | 'market-gap' | 'ai-stack' | 'ai-bubble-chart' | 'space-tech-bubble-chart' | 'robotics-bubble-chart'
  title?: string
  subtitle?: string
  sectors: Sector[]
  dimensions: {
    width: number
    height: number
  }
  theme?: 'light' | 'dark'
  showLegend?: boolean
  showWatermark?: boolean
  highlightPrivate?: boolean
  customBranding?: {
    logo?: boolean
    tagline?: string
  }
}

export interface ExportOptions {
  format: 'png' | 'svg'
  quality?: number // 0-1 for PNG
  scale?: number // Multiplier for resolution
  filename?: string
}

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, any>
}

export interface GrowthProjection {
  year: number
  publicValue: number
  privateValue: number
}

export type CanvasContext2D = CanvasRenderingContext2D

export interface RenderOptions {
  ctx: CanvasContext2D
  config: VisualizationConfig
  x: number
  y: number
  width: number
  height: number
}