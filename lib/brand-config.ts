// EQUIAM Brand Configuration - Extracted from equiam.com
export const brandConfig = {
  // Color Palette - Direct from EQUIAM design system
  colors: {
    primary: {
      900: '#0A0E27', // Deep navy background
      800: '#0F1538',
      700: '#1A2352',
      600: '#1464e9', // EQUIAM brand blue
      500: '#3B5BA9',
      400: '#609bfd', // Light brand blue
      300: '#8FA7E1',
      200: '#C3D3F4',
      100: '#E3ECFF', // Light backgrounds
      50: '#eff6ff',
    },
    accent: {
      neon: '#00FF94', // Success/growth metrics
      gold: '#FFD700', // Premium/top performance
      alert: '#FF3366', // Risk indicators
      dataViz: '#7C3AED', // Data visualization purple
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    neutral: {
      900: '#111827', // Text
      800: '#1F2937',
      700: '#374151',
      600: '#4B5563',
      500: '#6B7280',
      400: '#9CA3AF',
      300: '#D1D5DB',
      200: '#E5E7EB',
      100: '#F3F4F6',
      50: '#F9FAFB', // Backgrounds
      white: '#FFFFFF',
      black: '#000000',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAFA',
      tertiary: '#F8FAFF', // Subtle blue tint
      dark: '#0A0E27',
    },
    foreground: {
      primary: '#1a1a1a',
      secondary: '#4b5563',
      tertiary: '#9ca3af',
      light: '#f5f5f5',
    },
  },

  // Typography - PP Neue Montreal as primary
  typography: {
    fontFamily: {
      display: 'PP Neue Montreal, -apple-system, sans-serif',
      body: 'Inter, -apple-system, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      // Base sizes for canvas rendering (will be scaled for different formats)
      h1: 72,
      h2: 56,
      h3: 42,
      h4: 32,
      h5: 24,
      body: 18,
      bodyLarge: 20,
      bodySmall: 16,
      caption: 14,
      tiny: 12,
    },
    fontWeight: {
      thin: 100,
      book: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing system (in pixels for canvas)
  spacing: {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
    xxxl: 96,
    section: 128,
  },

  // Border radius values
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // Shadow effects
  shadows: {
    sm: {
      color: 'rgba(0, 0, 0, 0.05)',
      blur: 4,
      offsetY: 2,
    },
    md: {
      color: 'rgba(0, 0, 0, 0.1)',
      blur: 10,
      offsetY: 4,
    },
    lg: {
      color: 'rgba(0, 0, 0, 0.15)',
      blur: 20,
      offsetY: 8,
    },
    xl: {
      color: 'rgba(0, 0, 0, 0.2)',
      blur: 30,
      offsetY: 12,
    },
    glow: {
      primary: {
        color: 'rgba(20, 100, 233, 0.5)',
        blur: 20,
      },
      accent: {
        color: 'rgba(0, 255, 148, 0.5)',
        blur: 30,
      },
    },
  },

  // Visual effects
  effects: {
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    gradient: {
      primary: ['#1464e9', '#609bfd'],
      accent: ['#00FF94', '#00CC75'],
      dark: ['#0A0E27', '#1A2352'],
      subtle: ['#F8FAFF', '#FFFFFF'],
    },
  },

  // LinkedIn specific dimensions
  linkedIn: {
    // Optimal sizes for LinkedIn posts
    post: {
      width: 1200,
      height: 627, // 1.91:1 ratio
    },
    square: {
      width: 1200,
      height: 1200,
    },
    story: {
      width: 1080,
      height: 1920,
    },
    // High resolution for retina displays
    postHD: {
      width: 2400,
      height: 1254,
    },
    squareHD: {
      width: 2400,
      height: 2400,
    },
  },

  // Animation durations (for potential future use)
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
      verySlow: 1000,
    },
    easing: {
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
} as const

// Utility functions for brand consistency
export const brandUtils = {
  // Convert hex to rgba
  hexToRgba: (hex: string, alpha: number = 1): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  },

  // Get gradient string for canvas
  getGradient: (colors: string[], direction: 'horizontal' | 'vertical' = 'vertical') => {
    return { colors, direction }
  },

  // Scale font size based on canvas dimensions
  scaleFontSize: (baseFontSize: number, canvasWidth: number, referenceWidth: number = 1200): number => {
    return Math.round(baseFontSize * (canvasWidth / referenceWidth))
  },

  // Get shadow string for canvas
  getShadow: (shadow: typeof brandConfig.shadows.md) => {
    return {
      color: shadow.color,
      blur: shadow.blur,
      offsetX: 0,
      offsetY: shadow.offsetY,
    }
  },
}

export type BrandConfig = typeof brandConfig