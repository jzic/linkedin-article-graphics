'use client'

import React, { useState } from 'react'
import { ExportOptions } from '@/types'
import { brandConfig } from '@/lib/brand-config'

interface ExportControlsProps {
  canvasRef: HTMLCanvasElement | null
  onExport?: (options: ExportOptions) => void
}

export const ExportControls: React.FC<ExportControlsProps> = ({ canvasRef, onExport }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 1,
    scale: 1,
    filename: `equiam-visualization-${Date.now()}`,
  })

  const handleExport = () => {
    if (!canvasRef) return

    const { format, quality, filename } = exportOptions

    if (format === 'png') {
      canvasRef.toBlob(
        (blob) => {
          if (!blob) return
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${filename}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        },
        'image/png',
        quality
      )
    }

    if (onExport) {
      onExport(exportOptions)
    }
  }

  const presetSizes = [
    { name: 'LinkedIn Post', width: 1200, height: 627 },
    { name: 'LinkedIn Post HD', width: 2400, height: 1254 },
    { name: 'Square', width: 1200, height: 1200 },
    { name: 'Square HD', width: 2400, height: 2400 },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">Export Options</h3>
      
      <div className="space-y-3">
        {/* Preset sizes */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Preset Sizes
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presetSizes.map((preset) => (
              <button
                key={preset.name}
                className="px-3 py-2 text-sm bg-neutral-100 hover:bg-primary-100 rounded-lg transition-colors"
                onClick={() => {
                  // This would trigger a re-render with new dimensions
                  console.log(`Selected ${preset.name}: ${preset.width}x${preset.height}`)
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quality slider */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Quality: {Math.round(exportOptions.quality * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={exportOptions.quality}
            onChange={(e) =>
              setExportOptions({ ...exportOptions, quality: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>

        {/* Filename */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Filename
          </label>
          <input
            type="text"
            value={exportOptions.filename}
            onChange={(e) => setExportOptions({ ...exportOptions, filename: e.target.value })}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          disabled={!canvasRef}
          className="w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
        >
          Export as PNG
        </button>
      </div>
    </div>
  )
}