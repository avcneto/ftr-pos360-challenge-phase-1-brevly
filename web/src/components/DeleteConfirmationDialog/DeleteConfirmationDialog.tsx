import {
  DELETE_LINK_CANCEL_BUTTON_LABEL,
  DELETE_LINK_CONFIRM_BUTTON_LABEL,
  DELETE_LINK_CONFIRM_MESSAGE,
  DELETE_LINK_LOADING_LABEL,
} from '../../constants/texts'

type DeleteConfirmationDialogProps = {
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmationDialog = ({
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  return (
    <div className='fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-[460px] -translate-x-1/2 rounded-[8px] border border-gray-300 bg-gray-100 px-4 py-3'>
      <p className='text-sm-regular text-gray-600'>
        {DELETE_LINK_CONFIRM_MESSAGE}
      </p>

      <div className='mt-3 flex items-center justify-end gap-2'>
        <button
          type='button'
          className='text-sm-semibold rounded-[6px] border border-gray-300 px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onCancel}
          disabled={isDeleting}
        >
          {DELETE_LINK_CANCEL_BUTTON_LABEL}
        </button>
        <button
          type='button'
          className='text-sm-semibold rounded-[6px] bg-danger px-3 py-1.5 text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
          onClick={onConfirm}
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
  )
}

export { DeleteConfirmationDialog }
