import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  REDIRECTING_DESCRIPTION,
  REDIRECTING_FALLBACK_LINK,
  REDIRECTING_FALLBACK_PREFIX,
  REDIRECTING_TITLE,
} from '../constants/texts'

type OriginalUrlResponse = {
  id: string
  originalUrl: string
}

const Redirecting = () => {
  const navigate = useNavigate()
  const { shortUrl = '' } = useParams<{ shortUrl: string }>()
  const hasRedirectedRef = useRef(false)

  const { data, isSuccess, isError } = useQuery<OriginalUrlResponse>({
    queryKey: ['original-url', shortUrl],
    queryFn: async () => {
      const response = await fetch(
        `/links/original-url?shortUrl=${encodeURIComponent(shortUrl)}`
      )

      if (!response.ok) {
        throw new Error('Link not found')
      }

      return response.json()
    },
    retry: false,
  })

  useEffect(() => {
    if (!isSuccess || !data?.originalUrl || hasRedirectedRef.current) {
      return
    }

    hasRedirectedRef.current = true

    const timeout = setTimeout(async () => {
      try {
        await fetch(`/links/${data.id}/access`, {
          method: 'PATCH',
        })
      } catch {
        // Silently ignore errors on incrementing access count
      }

      window.location.replace(data.originalUrl)
    }, 1200)

    return () => clearTimeout(timeout)
  }, [data?.id, data?.originalUrl, isSuccess])

  useEffect(() => {
    if (shortUrl) {
      return
    }

    navigate('/not-found', { replace: true })
  }, [navigate, shortUrl])

  useEffect(() => {
    if (!isError) {
      return
    }

    navigate('/not-found', { replace: true })
  }, [isError, navigate])

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-300 px-4'>
      <section className='flex h-auto w-full max-w-[580px] flex-col items-center gap-6 rounded-[8px] bg-gray-100 px-6 py-10 md:h-[329px] md:px-12 md:py-16'>
        <img
          src='/Logo_Icon.svg'
          alt='Brevly logo'
          className='h-[56px] w-[56px]'
        />

        <h1 className='text-xi flex h-auto w-full max-w-full items-center justify-center text-center text-gray-600 md:h-[32px] md:max-w-[484px]'>
          {REDIRECTING_TITLE}
        </h1>

        <p className='text-md-semibold flex h-auto w-full max-w-full items-center justify-center text-center text-gray-500 md:h-[36px] md:max-w-[484px]'>
          {REDIRECTING_DESCRIPTION}
        </p>

        <p className='text-sm-regular text-center text-gray-500'>
          {REDIRECTING_FALLBACK_PREFIX}{' '}
          <Link
            to='/'
            className='text-sm-semibold text-blue-base hover:underline'
          >
            {REDIRECTING_FALLBACK_LINK}
          </Link>
        </p>
      </section>
    </main>
  )
}

export { Redirecting }
