'use client'

import React, { useState, useRef } from 'react'
import { VisualizationCanvas } from '@/components/VisualizationCanvas'
import { ExportControls } from '@/components/ExportControls'
import { VisualizationConfig, Sector } from '@/types'
import { brandConfig } from '@/lib/brand-config'
import sectorsData from '@/data/sectors.json'
import enhancedSectorsData from '@/data/sectors-enhanced.json'
import aiStackData from '@/data/ai-stack-august-2025.json'

export default function Home() {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)
  const [selectedVisualization, setSelectedVisualization] = useState<'sector-card' | 'comparison-chart' | 'ai-stack' | 'space-tech' | 'ai-bubble-chart' | 'space-tech-bubble-chart' | 'robotics-bubble-chart' | 'defense-tech-bubble-chart' | 'quantum-bubble-chart' | 'cybersecurity-bubble-chart'>('cybersecurity-bubble-chart')
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['ai', 'space-tech', 'fintech'])
  const [dimensions, setDimensions] = useState(brandConfig.linkedIn.postHD)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [title, setTitle] = useState('The Private Market Opportunity')
  const [subtitle, setSubtitle] = useState('Institutional investors are capturing 65% of tech growth through private markets')

  // Get selected sectors data - use enhanced data for better coverage
  const selectedSectorData: Sector[] = enhancedSectorsData.sectors.filter(s => 
    selectedSectors.includes(s.id)
  ) as Sector[]

  const config: VisualizationConfig = {
    type: selectedVisualization,
    title,
    subtitle,
    sectors: selectedSectorData,
    dimensions,
    theme,
    showLegend: true,
    showWatermark: true,
    highlightPrivate: true,
  }

  const visualizationTypes = [
    { id: 'ai-bubble-chart', name: 'AI Bubble Chart', description: 'Dynamic bubble visualization with company logos and brand colors' },
    { id: 'space-tech-bubble-chart', name: 'Space Tech Bubble Chart', description: 'Space industry bubble visualization with logarithmic scaling' },
    { id: 'robotics-bubble-chart', name: 'Robotics Bubble Chart', description: 'Physical robotics companies visualization' },
    { id: 'defense-tech-bubble-chart', name: 'Defense Tech Bubble Chart', description: 'Defense contractors vs defense tech innovators' },
    { id: 'quantum-bubble-chart', name: 'Quantum Bubble Chart', description: 'Quantum computing companies and tech giants' },
    { id: 'cybersecurity-bubble-chart', name: 'Cybersecurity Bubble Chart', description: 'Legacy giants vs cloud-native security innovators' },
    { id: 'ai-stack', name: 'AI Ecosystem Map', description: 'Complete view of public platforms vs private innovators' },
    { id: 'space-tech', name: 'Space Tech Map', description: 'Traditional aerospace vs new space companies' },
    { id: 'sector-card', name: 'Sector Cards', description: 'Individual sector breakdowns' },
    { id: 'comparison-chart', name: 'Comparison Chart', description: 'Side-by-side market comparison' },
  ]

  const dimensionPresets = [
    { name: 'LinkedIn Post', ...brandConfig.linkedIn.post },
    { name: 'LinkedIn Post HD', ...brandConfig.linkedIn.postHD },
    { name: 'Square', ...brandConfig.linkedIn.square },
    { name: 'Square HD', ...brandConfig.linkedIn.squareHD },
  ]

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            EQUIAM LinkedIn Graphics Generator
          </h1>
          <p className="text-lg text-neutral-600">
            Create professional visualizations for deep tech sector analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Visualization Type */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Visualization Type</h3>
              <div className="space-y-2">
                {visualizationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedVisualization(type.id as any)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedVisualization === type.id
                        ? 'bg-primary-100 border-2 border-primary-600'
                        : 'bg-neutral-50 border-2 border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    <div className="font-medium text-neutral-900">{type.name}</div>
                    <div className="text-sm text-neutral-600">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sector Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Select Sectors</h3>
              <div className="space-y-2">
                {enhancedSectorsData.sectors.map((sector) => (
                  <label key={sector.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSectors([...selectedSectors, sector.id])
                        } else {
                          setSelectedSectors(selectedSectors.filter(s => s !== sector.id))
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-neutral-700">{sector.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Customization</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Dimensions
                  </label>
                  <select
                    onChange={(e) => {
                      const preset = dimensionPresets.find(p => p.name === e.target.value)
                      if (preset) {
                        setDimensions({ width: preset.width, height: preset.height })
                      }
                    }}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {dimensionPresets.map((preset) => (
                      <option key={preset.name} value={preset.name}>
                        {preset.name} ({preset.width}x{preset.height})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Theme
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        theme === 'light'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 py-2 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'bg-primary-600 text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Canvas Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Preview</h3>
              <div className="overflow-auto">
                {selectedSectorData.length > 0 ? (
                  <VisualizationCanvas
                    config={config}
                    onCanvasReady={setCanvasElement}
                  />
                ) : (
                  <div className="text-center py-12 text-neutral-500">
                    Please select at least one sector to generate a visualization
                  </div>
                )}
              </div>
            </div>

            {/* Export Controls */}
            <ExportControls canvasRef={canvasElement} />
          </div>
        </div>
      </div>
    </main>
  )
}