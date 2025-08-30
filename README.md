# EQUIAM LinkedIn Graphics Generator

Professional deep tech sector visualization tool for generating LinkedIn-ready PNG graphics that align with the EQUIAM brand.

## Overview

This Next.js TypeScript application generates beautiful, data-rich visualizations comparing public vs. private market opportunities across deep tech sectors. Perfect for LinkedIn articles demonstrating the underexposure to private markets when only investing in public equities.

## Features

- **Canvas-based PNG Generation**: High-resolution export at LinkedIn-optimized dimensions
- **EQUIAM Brand Consistency**: Uses exact colors, typography, and design patterns from equiam.com
- **Multiple Visualization Types**:
  - Sector Cards: Individual sector breakdowns with public/private comparison
  - Comparison Charts: Side-by-side market analysis across sectors
- **Responsive Preview**: Real-time preview before export
- **Customizable**: Edit titles, subtitles, themes, and sector selection
- **Export Options**: Multiple resolution presets for LinkedIn (post, square, HD versions)

## Installation

1. Navigate to this directory:
```bash
cd "C:\Users\jzic2\EQUIAM Dropbox\EQUIAM's shared workspace\0 - Analysis & Research\12 - PythonProjects\linkedin_article_graphics"
```

2. Install dependencies (already done):
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Select Visualization Type**: Choose between Sector Cards or Comparison Chart
2. **Select Sectors**: Check the sectors you want to include (AI, Space Tech, FinTech, etc.)
3. **Customize**: Edit the title and subtitle to match your article
4. **Choose Theme**: Light or dark theme
5. **Select Dimensions**: Pick from LinkedIn-optimized presets
6. **Preview**: See real-time preview of your visualization
7. **Export**: Download as high-quality PNG

## Project Structure

```
linkedin_article_graphics/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles with EQUIAM fonts
├── components/            # React components
│   ├── VisualizationCanvas.tsx
│   └── ExportControls.tsx
├── lib/                   # Core libraries
│   ├── brand-config.ts    # EQUIAM brand tokens
│   ├── canvas-utils.ts    # Canvas rendering utilities
│   └── visualizations/    # Visualization templates
│       ├── sector-card.ts
│       └── comparison-chart.ts
├── data/                  # Sample data
│   └── sectors.json       # Sector and company data
├── public/
│   └── fonts/            # PP Neue Montreal font files
└── types/                # TypeScript definitions
```

## Brand Elements

The application uses the official EQUIAM brand elements:
- **Primary Blue**: #1464e9
- **Accent Green**: #00FF94 (for growth/private markets)
- **Typography**: PP Neue Montreal (display), Inter (body)
- **Deep Navy**: #0A0E27 (dark backgrounds)

## Customization

### Adding New Sectors
Edit `data/sectors.json` to add new sectors or companies.

### Creating New Visualizations
1. Create a new visualization class in `lib/visualizations/`
2. Extend the base rendering methods
3. Add the new type to the `VisualizationConfig` type
4. Update the switch statement in `VisualizationCanvas.tsx`

## LinkedIn Optimization

The tool provides preset dimensions optimized for LinkedIn:
- **Post (1200x627)**: Standard LinkedIn feed post
- **Post HD (2400x1254)**: High-resolution for retina displays
- **Square (1200x1200)**: Instagram cross-posting
- **Square HD (2400x2400)**: High-resolution square format

## Notes

- Fonts are preloaded from the local `public/fonts` directory
- All visualizations include subtle EQUIAM watermark
- Colors and styling strictly follow equiam.com design system
- Data can be easily updated without code changes