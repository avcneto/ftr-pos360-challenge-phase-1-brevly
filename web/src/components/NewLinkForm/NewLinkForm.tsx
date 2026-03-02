import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { RequestBanner } from '../RequestBanner'
import { useCreateLinkMutation } from '../../hooks/useCreateLinkMutation'
import { Button } from '../../ui'
import warningIcon from '../../assets/Warning.svg'
import {
  CREATE_LINK_ERROR_MESSAGE,
  CREATE_LINK_LOADING_MESSAGE,
  CREATE_LINK_SUCCESS_MESSAGE,
  INVALID_ORIGINAL_LINK_MESSAGE,
  INVALID_SHORT_LINK_MESSAGE,
  NEW_LINK_TITLE,
  ORIGINAL_LINK_LABEL,
  SAVE_LINK_BUTTON_LABEL,
  SHORT_LINK_LABEL,
} from '../../constants/texts'

type NewLinkFormData = {
  originalLink: string
  shortLink: string
}

type CreateLinkRequest = {
  originalUrl: string
  shortUrl: string
}

type CreateLinkResponse = {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: string
  createdAt: string
}

type BannerState = {
  type: 'success' | 'error'
  message: string
}

const normalizeUrl = (value: string) => {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `https://${value}`
}

const hasValidWebsitePattern = (hostname: string) => {
  return /^www\.[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(hostname)
}

const NewLinkForm = () => {
  const queryClient = useQueryClient()
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [originalLinkValue, setOriginalLinkValue] = useState('')
  const [shortLinkValue, setShortLinkValue] = useState('')
  const [banner, setBanner] = useState<BannerState | null>(null)
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewLinkFormData>({
    mode: 'onSubmit',
    defaultValues: {
      originalLink: '',
      shortLink: '',
    },
  })

  const showBanner = (type: BannerState['type'], message: string) => {
    setBanner({ type, message })

    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current)
    }

    bannerTimeoutRef.current = setTimeout(() => {
      setBanner(null)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current)
      }
    }
  }, [])

  const {
    mutate,
    isPending,
    reset: resetMutation,
  } = useCreateLinkMutation<CreateLinkRequest, CreateLinkResponse>('/links', {
    onSuccess: async () => {
      reset()
      setHasUserInteracted(false)
      setOriginalLinkValue('')
      setShortLinkValue('')

      await queryClient.invalidateQueries({ queryKey: ['links'] })
      showBanner('success', CREATE_LINK_SUCCESS_MESSAGE)
    },
    onError: (error) => {
      showBanner('error', error.message || CREATE_LINK_ERROR_MESSAGE)
    },
  })

  const onSubmit = (data: NewLinkFormData) => {
    resetMutation()

    mutate({
      originalUrl: normalizeUrl(data.originalLink),
      shortUrl: data.shortLink,
    })
  }

  const hasFormErrors = Boolean(errors.originalLink || errors.shortLink)
  const isSubmitDisabled =
    hasUserInteracted &&
    (!originalLinkValue?.trim() || !shortLinkValue?.trim())

  return (
    <section
      className={`flex w-full max-w-[380px] flex-col rounded-2xl bg-gray-100 p-8 ${hasFormErrors ? 'h-[400px]' : 'h-[340px]'}`}
    >
      <h1 className='text-lg-bold text-gray-600'>{NEW_LINK_TITLE}</h1>
      {banner && <RequestBanner type={banner.type} message={banner.message} />}

      <form
        className='mt-6 flex min-h-0 flex-1 flex-col gap-4'
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-3'>
            <label
              className='text-xs-uppercase text-gray-500'
              htmlFor='originalLink'
            >
              {ORIGINAL_LINK_LABEL}
            </label>
            <input
              id='originalLink'
              type='url'
              placeholder='www.exemplo.com.br'
              className={`text-md-regular h-12 w-full rounded-[8px] bg-gray-100 px-4 text-gray-600 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-base ${errors.originalLink ? 'border border-danger' : 'border border-gray-300'}`}
              {...register('originalLink', {
                onChange: (event) => {
                  setHasUserInteracted(true)
                  setOriginalLinkValue(event.target.value)
                },
                required: INVALID_ORIGINAL_LINK_MESSAGE,
                validate: (value) => {
                  try {
                    const normalizedValue = normalizeUrl(value)

                    const url = new URL(normalizedValue)
                    const isValidPattern = hasValidWebsitePattern(url.hostname)

                    if (!isValidPattern) {
                      return INVALID_ORIGINAL_LINK_MESSAGE
                    }

                    return true
                  } catch {
                    return INVALID_ORIGINAL_LINK_MESSAGE
                  }
                },
              })}
            />
            {errors.originalLink && (
              <p className='text-sm-regular flex items-center gap-2 text-danger'>
                <img src={warningIcon} alt='' aria-hidden='true' className='h-4 w-4' />
                {errors.originalLink.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-3'>
            <label
              className='text-xs-uppercase text-gray-500'
              htmlFor='shortLink'
            >
              {SHORT_LINK_LABEL}
            </label>
            <input
              id='shortLink'
              type='text'
              placeholder='brev.ly/'
              className={`text-md-regular h-12 w-full rounded-[8px] bg-gray-100 px-4 text-gray-600 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-base ${errors.shortLink ? 'border border-danger' : 'border border-gray-300'}`}
              {...register('shortLink', {
                onChange: (event) => {
                  setHasUserInteracted(true)
                  setShortLinkValue(event.target.value)
                },
                required: INVALID_SHORT_LINK_MESSAGE,
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: INVALID_SHORT_LINK_MESSAGE,
                },
              })}
            />
            {errors.shortLink && (
              <p className='text-sm-regular flex items-center gap-2 text-danger'>
                <img src={warningIcon} alt='' aria-hidden='true' className='h-4 w-4' />
                {errors.shortLink.message}
              </p>
            )}
          </div>
        </div>

        <Button
          className='mt-auto h-12 w-full text-md-semibold'
          type='submit'
          disabled={isSubmitDisabled || isPending}
        >
          {isPending ? (
            <span className='flex items-center gap-2'>
              <span
                className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'
                aria-hidden='true'
              />
              {CREATE_LINK_LOADING_MESSAGE}
            </span>
          ) : (
            SAVE_LINK_BUTTON_LABEL
          )}
        </Button>
      </form>
    </section>
  )
}

export { NewLinkForm }
