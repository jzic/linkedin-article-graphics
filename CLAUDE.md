# CLAUDE.md - LinkedIn Graphics Generator

## Project Overview

This is a Next.js TypeScript application that generates professional, EQUIAM-branded PNG graphics for LinkedIn articles. The tool creates data visualizations comparing public vs. private market opportunities across deep tech sectors, demonstrating the underexposure to private markets when only investing in public equities.

## Core Purpose

Generate compelling, data-rich visualizations that:
1. Show the disparity between public and private market opportunities
2. Highlight growth rates and market caps across sectors
3. Maintain strict adherence to EQUIAM's brand guidelines
4. Export in LinkedIn-optimized formats

## Technical Architecture

### Stack
- **Framework**: Next.js 15.5.0 with TypeScript
- **Styling**: Tailwind CSS with custom EQUIAM design tokens
- **Rendering**: HTML5 Canvas API for high-quality PNG generation
- **Fonts**: PP Neue Montreal (custom WOFF2 files included)
- **Data**: JSON-based sector and company information

### Key Design Decisions
- **Canvas-based rendering**: Chosen for pixel-perfect control and consistent cross-browser PNG generation
- **Client-side generation**: All rendering happens in the browser for instant previews
- **Component architecture**: Modular visualization templates for easy extension
- **Brand token system**: Centralized design system matching equiam.com

## EQUIAM Brand Guidelines

### Color Palette (from equiam.com)
```typescript
Primary Blues:
- #0A0E27 - Deep navy (backgrounds)
- #1464e9 - Main brand blue
- #609bfd - Light brand blue
- #E3ECFF - Light blue backgrounds

Accent Colors:
- #00FF94 - Success/growth (private markets)
- #FFD700 - Premium/top performance
- #FF3366 - Risk/alert indicators
- #7C3AED - Data visualization purple

Neutrals:
- #1a1a1a - Primary text
- #4b5563 - Secondary text
- #9ca3af - Tertiary text
- #FFFFFF - White backgrounds
```

### Typography
- **Display**: PP Neue Montreal (Bold, Medium, Book weights)
- **Body**: Inter
- **Monospace**: JetBrains Mono

### Visual Patterns
- **Border Radius**: 4px (sm), 8px (md), 12px (lg), 16px (xl)
- **Shadows**: Subtle layered shadows matching equiam.com
- **Spacing**: 8px base unit, scaling to 16, 24, 32, 48, 64, 96px
- **Glassmorphism**: Used sparingly for overlay elements

## Data Structure

### Sector Schema
```typescript
interface Sector {
  id: string              // Unique identifier (e.g., "ai", "space-tech")
  name: string            // Display name
  description?: string    // Optional description
  publicCompanies: Company[]
  privateCompanies: Company[]
  totalMarketSize: number // In billions USD
  privateMarketPercentage: number // 0-100
  averageGrowthRate?: number // YoY percentage
  color?: string         // Sector-specific brand color
}

interface Company {
  name: string
  logo?: string          // URL or base64
  marketCap: number      // Public companies (billions)
  valuation?: number     // Private companies (billions)
  growthRate?: number    // YoY percentage
  isPublic: boolean
  ticker?: string        // For public companies
  founded?: number       // Year founded
}
```

### Current Sectors
1. **Artificial Intelligence**: Google, Microsoft, Meta, NVIDIA vs OpenAI, Anthropic, Cohere
2. **Space Technology**: Traditional aerospace vs SpaceX, Blue Origin, Relativity
3. **FinTech**: PayPal, Block vs Stripe, Plaid, Chime
4. **Defense Technology**: Traditional contractors vs Anduril, Shield AI
5. **Robotics & Automation**: Intuitive Surgical vs Boston Dynamics, Waymo, Cruise

## Visualization Types

### 1. Sector Cards
- Individual cards for each sector
- Visual breakdown of public vs private market share
- Top companies listed with valuations
- Growth rate indicators
- Private market percentage bar

### 2. Comparison Chart
- Side-by-side bar charts
- Total market cap comparisons
- Growth rate overlays
- Key insights panel
- Legend and annotations

### 3. Growth Trajectory (Planned)
- Time-series projections
- Public vs private growth curves
- Market inflection points

## Canvas Rendering System

### Core Renderer (`lib/canvas-utils.ts`)
The `CanvasRenderer` class provides:
- High-quality rendering setup
- Text rendering with brand fonts
- Rounded rectangles with shadows
- Gradient backgrounds
- Company cards
- Progress bars
- Bar charts
- Watermark application

### Visualization Classes
Each visualization extends the base renderer:
```typescript
class SectorCardVisualization {
  render(): void {
    // 1. Set background
    // 2. Draw header
    // 3. Render sector cards
    // 4. Add watermark
  }
}
```

## Component Architecture

### Main Components

1. **VisualizationCanvas** (`components/VisualizationCanvas.tsx`)
   - Manages canvas element
   - Handles rendering lifecycle
   - Provides loading states

2. **ExportControls** (`components/ExportControls.tsx`)
   - Resolution presets
   - Quality settings
   - Filename configuration
   - Export triggering

3. **Main Dashboard** (`app/page.tsx`)
   - Visualization type selection
   - Sector selection
   - Customization controls
   - Live preview
   - Export interface

## LinkedIn Optimization

### Recommended Dimensions
```typescript
LinkedIn Post: 1200 x 627px (1.91:1 ratio)
LinkedIn Post HD: 2400 x 1254px (high DPI)
Square Format: 1200 x 1200px
Square HD: 2400 x 2400px
Story Format: 1080 x 1920px (9:16 ratio)
```

### Image Requirements
- Format: PNG with transparency support
- Quality: 0.9-1.0 for text clarity
- File size: Keep under 5MB for optimal loading
- Colors: sRGB color space

## Usage Patterns

### Basic Workflow
1. Select visualization type
2. Choose sectors to include
3. Customize title/subtitle
4. Select theme (light/dark)
5. Choose export dimensions
6. Preview in real-time
7. Export as PNG

### Advanced Customization
- Edit `data/sectors.json` for data updates
- Modify `lib/brand-config.ts` for brand changes
- Create new visualizations in `lib/visualizations/`
- Extend types in `types/index.ts`

## Performance Considerations

### Optimizations
- Canvas operations batched for efficiency
- Font preloading via WOFF2
- Lazy loading of visualization components
- Efficient data structures for rendering

### Limitations
- Maximum canvas size varies by browser (~16384x16384px)
- Memory usage scales with canvas dimensions
- Complex visualizations may take 1-2 seconds to render

## Extension Points

### Adding New Visualizations
1. Create class in `lib/visualizations/`
2. Implement `render()` method
3. Add type to `VisualizationConfig`
4. Update switch in `VisualizationCanvas`

### Adding New Sectors
1. Edit `data/sectors.json`
2. Include company data with valuations
3. Assign sector color from brand palette
4. Test rendering at multiple dimensions

### Customizing Brand
1. Update `lib/brand-config.ts`
2. Modify color tokens
3. Adjust typography settings
4. Update spacing/sizing scales

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## File Structure
```
linkedin_article_graphics/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx            # Main dashboard interface
│   └── globals.css         # Global styles, font imports
│
├── components/              # React components
│   ├── VisualizationCanvas.tsx  # Canvas wrapper
│   └── ExportControls.tsx      # Export UI controls
│
├── lib/                     # Core libraries
│   ├── brand-config.ts     # EQUIAM design tokens
│   ├── canvas-utils.ts     # Canvas rendering utilities
│   └── visualizations/     # Visualization templates
│       ├── sector-card.ts  # Sector card renderer
│       └── comparison-chart.ts # Comparison renderer
│
├── data/                    # Data files
│   └── sectors.json        # Sector and company data
│
├── public/                  # Static assets
│   └── fonts/              # PP Neue Montreal WOFF2
│
├── types/                   # TypeScript definitions
│   └── index.ts            # Shared type definitions
│
└── Configuration Files
    ├── next.config.js      # Next.js configuration
    ├── tailwind.config.js  # Tailwind + EQUIAM colors
    ├── tsconfig.json       # TypeScript configuration
    └── postcss.config.js   # PostCSS for Tailwind
```

## Common Tasks

### Update Company Data
```typescript
// Edit data/sectors.json
{
  "name": "NewCompany",
  "valuation": 10.5,
  "growthRate": 150,
  "isPublic": false,
  "founded": 2020
}
```

### Change Brand Colors
```typescript
// Edit lib/brand-config.ts
colors: {
  primary: {
    600: '#YOUR_NEW_COLOR'
  }
}
```

### Add Custom Font
1. Add WOFF2 files to `public/fonts/`
2. Update `app/globals.css` with @font-face
3. Modify `lib/brand-config.ts` typography

### Create New Export Preset
```typescript
// In components/ExportControls.tsx
const presetSizes = [
  { name: 'Custom Size', width: 1600, height: 900 },
  // ... existing presets
]
```

## Troubleshooting

### Fonts Not Loading
- Verify WOFF2 files in `public/fonts/`
- Check @font-face declarations in `globals.css`
- Ensure font-family matches in brand-config.ts

### Canvas Rendering Issues
- Check browser console for errors
- Verify canvas dimensions are within limits
- Ensure proper context (2d) initialization

### Export Not Working
- Verify canvas element reference
- Check blob generation in ExportControls
- Ensure proper MIME type (image/png)

### Data Not Updating
- Clear browser cache
- Verify JSON syntax in sectors.json
- Check import statements in components

## Best Practices

### For Brand Consistency
- Always reference `brandConfig` for colors/spacing
- Use `brandUtils` helper functions
- Test on multiple screen sizes
- Verify against equiam.com

### For Performance
- Limit canvas dimensions to necessary size
- Batch canvas operations
- Use requestAnimationFrame for animations
- Optimize data structures

### For Maintainability
- Keep visualizations modular
- Document data schema changes
- Use TypeScript strictly
- Follow existing patterns

## Future Enhancements

### Planned Features
1. **Growth Trajectory Visualization**: Time-series charts showing projected growth
2. **Market Gap Analysis**: Visual representation of opportunity cost
3. **Portfolio Visualization**: Show EQUIAM's portfolio companies
4. **Animated Exports**: GIF/video generation for dynamic content
5. **Template Library**: Pre-configured templates for common use cases
6. **Cloud Storage**: Save/load configurations
7. **Batch Export**: Generate multiple graphics at once
8. **API Integration**: Pull live market data
9. **Collaborative Features**: Share and collaborate on designs
10. **A/B Testing**: Compare different visualization styles

### Technical Improvements
- Server-side rendering for SEO
- WebGL acceleration for complex graphics
- Progressive Web App capabilities
- Automated testing suite
- CI/CD pipeline
- Performance monitoring

## Security Considerations

- No sensitive data stored client-side
- All rendering happens locally
- No external API calls for core functionality
- Fonts served locally (no CDN dependencies)
- No user authentication required

## Maintenance Notes

### Regular Updates Needed
1. Company valuations (quarterly)
2. Market cap data (monthly)
3. Growth rates (quarterly)
4. New sector additions (as needed)
5. Brand updates (following equiam.com)

### Dependencies to Monitor
- Next.js updates (security patches)
- React version compatibility
- Tailwind CSS major versions
- TypeScript compiler updates

## Contact & Support

For questions or improvements:
- Review this documentation first
- Check existing code patterns
- Test thoroughly with sample data
- Maintain brand consistency
- Consider LinkedIn's image requirements

This tool is critical for EQUIAM's content marketing strategy, demonstrating thought leadership in private market analysis through compelling, data-driven visualizations.