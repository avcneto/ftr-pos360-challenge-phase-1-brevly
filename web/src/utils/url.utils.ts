/**
 * Normalizes a URL by adding https:// protocol if not present
 */
export const normalizeUrl = (value: string): string => {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `https://${value}`
}

/**
 * Validates if a hostname follows the pattern www.domain.extension
 */
export const hasValidWebsitePattern = (hostname: string): boolean => {
  return /^www\.[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(hostname)
}

/**
 * Normalizes a short URL by removing leading slash if present
 */
export const normalizeShortUrl = (shortUrl: string): string => {
  return shortUrl.startsWith('/') ? shortUrl.slice(1) : shortUrl
}

/**
 * Builds a full short URL with the current origin
 */
export const buildFullShortUrl = (shortUrl: string): string => {
  const normalized = normalizeShortUrl(shortUrl)
  return `${window.location.origin}/${normalized}`
}
