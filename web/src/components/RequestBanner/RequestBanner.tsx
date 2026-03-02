type RequestBannerProps = {
  message: string
  type: 'success' | 'error'
}

const stylesByType = {
  success: 'border-green-300 bg-green-100 text-green-700',
  error: 'border-red-300 bg-red-100 text-red-700',
} as const

const RequestBanner = ({ message, type }: RequestBannerProps) => {
  return (
    <p
      className={`text-sm-regular fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 rounded-[8px] border px-4 py-3 ${stylesByType[type]}`}
      role='alert'
    >
      {message}
    </p>
  )
}

export { RequestBanner }
