import type { IconButtonProps } from './entities'

const IconButton = ({ icon, label, className, ...props }: IconButtonProps) => {
  return (
    <button
      className={`flex h-8 w-[70px] cursor-pointer flex-row items-center justify-center gap-1.5 rounded-[4px] border border-transparent bg-gray-200 px-2 text-sm-regular transition-colors hover:border-blue-base disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`.trim()}
      {...props}
    >
      <img src={icon} alt={label} className='h-4 w-4' />
      <span className='truncate'>{label}</span>
    </button>
  )
}

export { IconButton }
