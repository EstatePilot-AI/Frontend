const FALLBACK_THEME = Object.freeze({
  text: '#475569',
  mutedText: '#94A3B8',
  border: '#E2E8F0',
  surface: '#FFFFFF',
  accent: '#047857',
  accentSoft: 'rgba(4, 120, 87, 0.18)',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  danger: '#EF4444',
})

const CATEGORY_COLOR_MAP = Object.freeze({
  interested: 'success',
  notanswer: 'info',
  notinterested: 'warning',
  failed: 'danger',
  available: 'success',
  sold: 'warning',
  reserved: 'info',
})

const readCssVar = (name, fallback) => {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

const normalizeCategoryName = (value = '') => value.toString().replace(/\s+/g, '').toLowerCase()

export const getDashboardChartTheme = () => ({
  text: readCssVar('--color-text-secondary', FALLBACK_THEME.text),
  mutedText: readCssVar('--color-text-muted', FALLBACK_THEME.mutedText),
  border: readCssVar('--color-border', FALLBACK_THEME.border),
  surface: readCssVar('--color-surface-elevated', FALLBACK_THEME.surface),
  accent: readCssVar('--color-primary', FALLBACK_THEME.accent),
  accentSoft: readCssVar('--color-primary-soft', FALLBACK_THEME.accentSoft),
  success: readCssVar('--color-success', FALLBACK_THEME.success),
  warning: readCssVar('--color-warning', FALLBACK_THEME.warning),
  info: readCssVar('--color-info', FALLBACK_THEME.info),
  danger: readCssVar('--color-danger', FALLBACK_THEME.danger),
})

export const getCategoryColor = (name, theme, index = 0) => {
  const paletteTheme = theme || FALLBACK_THEME
  const normalizedName = normalizeCategoryName(name)
  const mappedSemanticColor = CATEGORY_COLOR_MAP[normalizedName]

  if (mappedSemanticColor && paletteTheme[mappedSemanticColor]) {
    return paletteTheme[mappedSemanticColor]
  }

  const fallbackPalette = [paletteTheme.success, paletteTheme.info, paletteTheme.warning, paletteTheme.danger]
  return fallbackPalette[index % fallbackPalette.length]
}
