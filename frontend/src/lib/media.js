export function resolveMediaUrl(value) {
  if (!value) return ''

  if (/^(https?:|data:|blob:)/i.test(value)) return value

  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

  if (value.startsWith('/')) {
    return base ? `${base}${value}` : value
  }

  return base ? `${base}/${value.replace(/^\//, '')}` : value
}