import { IconButton } from '../../ui'
import downloadIcon from '../../assets/DownloadSimple.svg'
import { MyLinkItem } from './MyLinkItem'
import {
  DOWNLOAD_CSV_LABEL,
  EXAMPLE_ACCESS_COUNT,
  EXAMPLE_ORIGINAL_URL,
  EXAMPLE_SHORT_URL,
  MY_LINKS_TITLE,
} from '../../constants/texts'

const MyLinks = () => {
  return (
    <section className='flex min-h-[234px] w-full max-w-[580px] max-h-[600px] flex-col rounded-2xl bg-gray-100 p-8'>
      <div className='flex w-full items-center justify-between gap-3'>
        <h2 className='text-xi text-gray-600'>{MY_LINKS_TITLE}</h2>
        <IconButton
          icon={downloadIcon}
          label={DOWNLOAD_CSV_LABEL}
          className='w-[144px] text-sm-semibold text-gray-400'
        />
      </div>

      <div className='mt-5 h-px w-full bg-gray-200' />

      <div className='mt-5 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto'>
        <MyLinkItem
          shortUrl={EXAMPLE_SHORT_URL}
          originalUrl={EXAMPLE_ORIGINAL_URL}
          accessCount={EXAMPLE_ACCESS_COUNT}
        />
      </div>
    </section>
  )
}

export { MyLinks }
