import { useEffect, useRef, useState } from 'react'
import type { BannerState, BannerType } from '../types'

const BANNER_DISPLAY_DURATION = 3000

export const useBanner = () => {
  const [banner, setBanner] = useState<BannerState | null>(null)
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showBanner = (type: BannerType, message: string) => {
    setBanner({ type, message })

    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current)
    }

    bannerTimeoutRef.current = setTimeout(() => {
      setBanner(null)
    }, BANNER_DISPLAY_DURATION)
  }

  const hideBanner = () => {
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current)
    }
    setBanner(null)
  }

  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current)
      }
    }
  }, [])

  return { banner, showBanner, hideBanner }
}
