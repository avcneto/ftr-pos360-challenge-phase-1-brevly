import { IconButton } from '../../ui'
import downloadIcon from '../../assets/DownloadSimple.svg'
import { MyLinkItem } from './MyLinkItem'

const MyLinks = () => {
  return (
    <section className='flex min-h-[234px] w-full max-w-[580px] max-h-[600px] flex-col rounded-2xl bg-gray-100 p-8'>
      <div className='flex w-full items-center justify-between gap-3'>
        <h2 className='text-xi text-gray-600'>Meus links</h2>
        <IconButton
          icon={downloadIcon}
          label='Baixar CSV'
          className='w-[144px] text-sm-semibold text-gray-400'
        />
      </div>

      <div className='mt-5 h-px w-full bg-gray-200' />

      <div className='mt-5 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto'>
        <MyLinkItem
          shortUrl='brev.ly/Portfolio-Dev'
          originalUrl='devsite.portfolio.com.br/devname-123456'
          accessCount={30}
        />
      </div>
    </section>
  )
}

export { MyLinks }
