import { useState } from 'react'
import { IconButton } from '../../ui'
import downloadIcon from '../../assets/DownloadSimple.svg'
import linkIcon from '../../assets/Link.svg'
import { Loading } from '../Loading'
import { RequestBanner } from '../RequestBanner'
import { DeleteConfirmationDialog } from '../DeleteConfirmationDialog'
import { useDownloadLinksCsvQuery } from '../../hooks/useDownloadLinksCsvQuery'
import { useDeleteLinkMutation } from '../../hooks/useDeleteLinkMutation'
import { useListLinksQuery } from '../../hooks/useListLinksQuery'
import { useBanner } from '../../hooks/useBanner'
import { buildFullShortUrl, normalizeShortUrl } from '../../utils'
import { MyLinkItem } from './MyLinkItem'
import {
  COPY_LINK_ERROR_MESSAGE,
  COPY_LINK_SUCCESS_MESSAGE,
  DELETE_LINK_ERROR_MESSAGE,
  DELETE_LINK_SUCCESS_MESSAGE,
  DOWNLOAD_CSV_LABEL,
  DOWNLOAD_CSV_LOADING_LABEL,
  MY_LINKS_LOADING_LABEL,
  MY_LINKS_TITLE,
} from '../../constants/texts'

const MyLinks = () => {
  const [linkIdToDelete, setLinkIdToDelete] = useState<string | null>(null)
  const { banner, showBanner } = useBanner()
  const {
    data: links = [],
    refetch: refetchLinks,
    isLoading: isLinksLoading,
    isFetching: isLinksFetching,
  } = useListLinksQuery()
  const { refetch, isFetching } = useDownloadLinksCsvQuery()

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

  const downloadLinksCsv = async () => {
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

  const openDeleteDialog = (id: string) => {
    setLinkIdToDelete(id)
  }

  const copyShortUrlToClipboard = async (shortUrl: string) => {
    try {
      const fullShortUrl = buildFullShortUrl(shortUrl)
      await navigator.clipboard.writeText(fullShortUrl)
      showBanner('success', COPY_LINK_SUCCESS_MESSAGE)
    } catch {
      showBanner('error', COPY_LINK_ERROR_MESSAGE)
    }
  }

  const openShortUrlInNewTab = (shortUrl: string) => {
    const normalized = normalizeShortUrl(shortUrl)
    window.open(`/${normalized}`, '_blank', 'noopener,noreferrer')
  }

  const cancelDelete = () => {
    setLinkIdToDelete(null)
  }

  const confirmDelete = () => {
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
          onClick={downloadLinksCsv}
          disabled={isFetching || links.length === 0}
        />
      </div>

      <div className='mt-5 h-px w-full bg-gray-200' />

      <div className='mt-5 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-2 [scrollbar-gutter:stable]'>
        {(isLinksLoading || isLinksFetching) && (
          <div className='flex flex-1 items-center justify-center'>
            <Loading label={MY_LINKS_LOADING_LABEL} />
          </div>
        )}

        {!isLinksLoading && !isLinksFetching && links.length === 0 && (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <img src={linkIcon} alt='Link icon' className='h-8 w-8' />
            <p className='flex h-[18px] w-[284px] items-center justify-center text-center text-[10px] font-normal leading-[14px] uppercase text-[#4D505C]'>
              Ainda não existem links cadastrados
            </p>
          </div>
        )}

        {links.map((item) => (
          <MyLinkItem
            key={item.id}
            shortUrl={item.shortUrl}
            originalUrl={item.originalUrl}
            accessCount={Number(item.accessCount)}
            onOpen={() => openShortUrlInNewTab(item.shortUrl)}
            onCopy={() => copyShortUrlToClipboard(item.shortUrl)}
            onDelete={() => openDeleteDialog(item.id)}
          />
        ))}
      </div>

      {linkIdToDelete && (
        <DeleteConfirmationDialog
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </section>
  )
}

export { MyLinks }
