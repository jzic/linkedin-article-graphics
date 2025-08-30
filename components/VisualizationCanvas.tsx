'use client'

import React, { useRef, useEffect, useState } from 'react'
import { CanvasRenderer } from '@/lib/canvas-utils'
import { SectorCardVisualization } from '@/lib/visualizations/sector-card'
import { ComparisonChartVisualization } from '@/lib/visualizations/comparison-chart'
import { AIStackElegantVisualization } from '@/lib/visualizations/ai-stack-elegant'
import { AIStackRefinedVisualization } from '@/lib/visualizations/ai-stack-refined'
import { AIPurePlayVisualization } from '@/lib/visualizations/ai-pure-play'
import { AIEcosystemHonestVisualization } from '@/lib/visualizations/ai-ecosystem-honest'
import { AIEcosystemBoldVisualization } from '@/lib/visualizations/ai-ecosystem-bold'
import { AIEcosystemCleanVisualization } from '@/lib/visualizations/ai-ecosystem-clean'
import { AISimpleLogosVisualization } from '@/lib/visualizations/ai-simple-logos'
import { SpaceTechMapVisualization } from '@/lib/visualizations/space-tech-map'
import { AIBubbleChartVisualization } from '@/lib/visualizations/ai-bubble-chart'
import { SpaceTechBubbleChartVisualization } from '@/lib/visualizations/space-tech-bubble-chart'
import { RoboticsBubbleChartVisualization } from '@/lib/visualizations/robotics-bubble-chart'
import { DefenseTechBubbleChartVisualization } from '@/lib/visualizations/defense-tech-bubble-chart'
import { QuantumBubbleChartVisualization } from '@/lib/visualizations/quantum-bubble-chart'
import { CybersecurityBubbleChartVisualization } from '@/lib/visualizations/cybersecurity-bubble-chart'
import { VisualizationConfig } from '@/types'
import { brandConfig } from '@/lib/brand-config'
import aiStackData from '@/data/ai-stack-august-2025.json'

interface VisualizationCanvasProps {
  config: VisualizationConfig
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

export const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({ config, onCanvasReady }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRendering, setIsRendering] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    let isCancelled = false
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = config.dimensions.width
    canvas.height = config.dimensions.height

    // Create renderer
    const renderer = new CanvasRenderer(ctx, config.dimensions.width, config.dimensions.height)

    // Render based on visualization type
    setIsRendering(true)
    
    const renderVisualization = async () => {
      if (isCancelled) return
      
      switch (config.type) {
        case 'ai-bubble-chart':
          const bubbleViz = new AIBubbleChartVisualization(renderer, config.dimensions)
          await bubbleViz.render()
          break
        case 'ai-stack':
          const aiStackViz = new AISimpleLogosVisualization(renderer, config.dimensions)
          await aiStackViz.render()
          break
        case 'space-tech':
          const spaceTechViz = new SpaceTechMapVisualization(renderer, config.dimensions)
          await spaceTechViz.render()
          break
        case 'space-tech-bubble-chart':
          const spaceBubbleViz = new SpaceTechBubbleChartVisualization(renderer, config.dimensions)
          await spaceBubbleViz.render()
          break
        case 'robotics-bubble-chart':
          const roboticsBubbleViz = new RoboticsBubbleChartVisualization(renderer, config.dimensions)
          await roboticsBubbleViz.render()
          break
        case 'defense-tech-bubble-chart':
          const defenseBubbleViz = new DefenseTechBubbleChartVisualization(renderer, config.dimensions)
          await defenseBubbleViz.render()
          break
        case 'quantum-bubble-chart':
          const quantumBubbleViz = new QuantumBubbleChartVisualization(renderer, config.dimensions)
          await quantumBubbleViz.render()
          break
        case 'cybersecurity-bubble-chart':
          const cybersecurityBubbleViz = new CybersecurityBubbleChartVisualization(renderer, config.dimensions)
          await cybersecurityBubbleViz.render()
          break
        case 'sector-card':
          const sectorViz = new SectorCardVisualization(renderer, config)
          sectorViz.render()
          break
        case 'comparison-chart':
          const comparisonViz = new ComparisonChartVisualization(renderer, config)
          comparisonViz.render()
          break
      }
      
      if (!isCancelled) {
        setIsRendering(false)
        // Notify parent component
        if (onCanvasReady) {
          onCanvasReady(canvas)
        }
      }
    }
    
    renderVisualization()

    return () => {
      isCancelled = true
    }
  }, [config, onCanvasReady])

  return (
    <div className="relative">
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-sm text-neutral-600">Rendering visualization...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg shadow-xl"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}