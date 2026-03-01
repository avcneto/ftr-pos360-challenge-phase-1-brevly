import { IconButton } from '../../ui'
import downloadIcon from '../../assets/DownloadSimple.svg'
import linkIcon from '../../assets/Link.svg'

const MyLinks = () => {
  return (
    <section className='min-h-[400px] w-full max-w-md rounded-2xl bg-gray-100 px-6 py-8 md:px-10 md:py-11 lg:h-[486px] lg:max-w-[580px]'>
      <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='text-xi text-gray-600'>Meus links</h2>
        <IconButton
          disabled
          icon={downloadIcon}
          label='Baixar CSV'
          className='w-[144px] text-sm-semibold text-gray-400 hover:border-transparent'
        />
      </div>

      <div className='mt-7 h-px w-full bg-gray-200' />

      <div className='flex min-h-[250px] flex-col items-center justify-center gap-5 md:h-[314px]'>
        <img src={linkIcon} alt='Sem links' className='h-10 w-10 opacity-70' />
        <p className='text-sm-semibold uppercase text-gray-500'>
          Ainda não existem links cadastrados
        </p>
      </div>
    </section>
  )
}

export { MyLinks }
