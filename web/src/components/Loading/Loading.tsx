type LoadingProps = {
  label: string
}

const Loading = ({ label }: LoadingProps) => {
  return (
    <div className='flex items-center gap-2 text-sm-regular text-gray-500' role='status'>
      <span
        className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-base'
        aria-hidden='true'
      />
      <span>{label}</span>
    </div>
  )
}

export { Loading }
