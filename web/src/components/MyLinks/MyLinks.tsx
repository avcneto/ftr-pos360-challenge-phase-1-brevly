import { useEffect, useRef, useState } from 'react'
import { IconButton } from '../../ui'
import downloadIcon from '../../assets/DownloadSimple.svg'
import { Loading } from '../Loading'
import { RequestBanner } from '../RequestBanner'
import { useDownloadLinksCsvQuery } from '../../hooks/useDownloadLinksCsvQuery'
import { useDeleteLinkMutation } from '../../hooks/useDeleteLinkMutation'
import { useListLinksQuery } from '../../hooks/useListLinksQuery'
import { MyLinkItem } from './MyLinkItem'
import {
  COPY_LINK_ERROR_MESSAGE,
  COPY_LINK_SUCCESS_MESSAGE,
  DELETE_LINK_CANCEL_BUTTON_LABEL,
  DELETE_LINK_CONFIRM_BUTTON_LABEL,
  DELETE_LINK_ERROR_MESSAGE,
  DELETE_LINK_CONFIRM_MESSAGE,
  DELETE_LINK_LOADING_LABEL,
  DELETE_LINK_SUCCESS_MESSAGE,
  DOWNLOAD_CSV_LABEL,
  DOWNLOAD_CSV_LOADING_LABEL,
  MY_LINKS_LOADING_LABEL,
  MY_LINKS_TITLE,
} from '../../constants/texts'

type BannerState = {
  type: 'success' | 'error'
  message: string
}

const MyLinks = () => {
  const [linkIdToDelete, setLinkIdToDelete] = useState<string | null>(null)
  const [banner, setBanner] = useState<BannerState | null>(null)
  const bannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const {
    data: links = [],
    refetch: refetchLinks,
    isLoading: isLinksLoading,
    isFetching: isLinksFetching,
  } = useListLinksQuery()
  const { refetch, isFetching } = useDownloadLinksCsvQuery()

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

  const { mutate: deleteLink, isPending: isDeleting } = useDeleteLinkMutation({
    onSuccess: async (data) => {
      setLinkIdToDelete(null)
      await refetchLinks()
      showBanner('success', data.message || DELETE_LINK_SUCCESS_MESSAGE)
    },
    onError: (error) => {
      setLinkIdToDelete(null)
      showBanner('error', error.message || DELETE_LINK_ERROR_MESSAGE)
    },
  })

  const handleDownloadCsv = async () => {
    const result = await refetch()

    if (!result.data) {
      return
    }

    const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = 'links.csv'
    anchor.click()

    URL.revokeObjectURL(url)
  }

  const handleOpenDeleteConfirmation = (id: string) => {
    setLinkIdToDelete(id)
  }

  const handleCopyShortUrl = async (shortUrl: string) => {
    try {
      const normalizedShortUrl = shortUrl.startsWith('/')
        ? shortUrl.slice(1)
        : shortUrl
      const fullShortUrl = `${window.location.origin}/${normalizedShortUrl}`

      await navigator.clipboard.writeText(fullShortUrl)
      showBanner('success', COPY_LINK_SUCCESS_MESSAGE)
    } catch {
      showBanner('error', COPY_LINK_ERROR_MESSAGE)
    }
  }

  const handleOpenShortUrl = (shortUrl: string) => {
    const normalizedShortUrl = shortUrl.startsWith('/')
      ? shortUrl.slice(1)
      : shortUrl

    window.open(`/${normalizedShortUrl}`, '_blank', 'noopener,noreferrer')
  }

  const handleCancelDelete = () => {
    setLinkIdToDelete(null)
  }

  const handleConfirmDelete = () => {
    if (!linkIdToDelete) {
      return
    }

    deleteLink(linkIdToDelete)
  }

  return (
    <section className='flex min-h-[234px] w-full max-w-[580px] max-h-[600px] flex-col rounded-2xl bg-gray-100 p-8'>
      {banner && <RequestBanner type={banner.type} message={banner.message} />}

      <div className='flex w-full items-center justify-between gap-3'>
        <h2 className='text-xi text-gray-600'>{MY_LINKS_TITLE}</h2>
        <IconButton
          icon={downloadIcon}
          label={isFetching ? DOWNLOAD_CSV_LOADING_LABEL : DOWNLOAD_CSV_LABEL}
          isLoading={isFetching}
          className='w-[144px] text-sm-semibold text-gray-400'
          onClick={handleDownloadCsv}
          disabled={isFetching || links.length === 0}
        />
      </div>

      <div className='mt-5 h-px w-full bg-gray-200' />

      <div className='mt-5 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-2 [scrollbar-gutter:stable]'>
        {(isLinksLoading || isLinksFetching) && (
          <Loading label={MY_LINKS_LOADING_LABEL} />
        )}

        {links.map((item) => (
          <MyLinkItem
            key={item.id}
            shortUrl={item.shortUrl}
            originalUrl={item.originalUrl}
            accessCount={Number(item.accessCount)}
            onOpen={() => handleOpenShortUrl(item.shortUrl)}
            onCopy={() => handleCopyShortUrl(item.shortUrl)}
            onDelete={() => handleOpenDeleteConfirmation(item.id)}
          />
        ))}
      </div>

      {linkIdToDelete && (
        <div className='fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 rounded-[8px] border border-gray-300 bg-gray-100 px-4 py-3'>
          <p className='text-sm-regular text-gray-600'>
            {DELETE_LINK_CONFIRM_MESSAGE}
          </p>

          <div className='mt-3 flex items-center justify-end gap-2'>
            <button
              type='button'
              className='text-sm-semibold rounded-[6px] border border-gray-300 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              {DELETE_LINK_CANCEL_BUTTON_LABEL}
            </button>
            <button
              type='button'
              className='text-sm-semibold rounded-[6px] bg-danger px-3 py-1.5 text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className='flex items-center gap-2'>
                  <span
                    className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'
                    aria-hidden='true'
                  />
                  {DELETE_LINK_LOADING_LABEL}
                </span>
              ) : (
                DELETE_LINK_CONFIRM_BUTTON_LABEL
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export { MyLinks }
