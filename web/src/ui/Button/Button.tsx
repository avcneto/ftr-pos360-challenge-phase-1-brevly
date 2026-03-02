import type { ButtonProps } from './entities'

const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`flex h-12 w-[352px] cursor-pointer flex-row items-center justify-center gap-3 rounded-[8px] bg-blue-base px-5 text-md-semibold text-white transition-colors hover:bg-blue-dark disabled:cursor-not-allowed disabled:bg-blue-base disabled:opacity-50 disabled:hover:bg-blue-base ${className ?? ''}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
