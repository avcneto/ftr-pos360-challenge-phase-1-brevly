import copyIcon from '../../assets/Copy.svg'
import trashIcon from '../../assets/Trash.svg'
import { ACCESSES_LABEL } from '../../constants/texts'

type MyLinkItemProps = {
  shortUrl: string
  originalUrl: string
  accessCount: number
  onOpen?: () => void
  onCopy?: () => void
  onDelete?: () => void
}

const MyLinkItem = ({ shortUrl, originalUrl, accessCount, onOpen, onCopy, onDelete }: MyLinkItemProps) => {
  return (
    <article className='flex w-full items-center justify-between gap-4'>
      <div className='flex w-[347px] min-w-0 flex-col gap-1'>
        <button
          type='button'
          className='text-md-semibold h-[18px] cursor-pointer truncate text-left text-blue-base hover:underline'
          onClick={onOpen}
        >
          {shortUrl}
        </button>
        <p className='text-sm-regular h-[16px] truncate text-gray-500'>
          {originalUrl}
        </p>
      </div>

      <div className='flex items-center gap-4'>
        <p className='text-sm-regular h-[16px] w-[61px] text-right text-gray-500'>
          {accessCount} {ACCESSES_LABEL}
        </p>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            aria-label='Copiar link'
            className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] bg-gray-200 transition-colors hover:border hover:border-blue-base'
            onClick={onCopy}
          >
            <img src={copyIcon} alt='' aria-hidden='true' className='h-4 w-4' />
          </button>

          <button
            type='button'
            aria-label='Excluir link'
            className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] bg-gray-200 transition-colors hover:border hover:border-blue-base'
            onClick={onDelete}
          >
            <img src={trashIcon} alt='' aria-hidden='true' className='h-4 w-4' />
          </button>
        </div>
      </div>
    </article>
  )
}

export { MyLinkItem }
