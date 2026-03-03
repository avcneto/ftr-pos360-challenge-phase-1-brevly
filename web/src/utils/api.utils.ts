/**
 * Constrói a URL completa da API usando VITE_API_URL
 * @param path - Caminho relativo (ex: '/links' ou 'links')
 * @returns URL completa da API
 */
export const buildApiUrl = (path: string): string => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333'
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiUrl}${normalizedPath}`
}
