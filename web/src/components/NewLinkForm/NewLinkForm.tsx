import { useForm } from 'react-hook-form'
import { Button } from '../../ui'

type NewLinkFormData = {
  originalLink: string
  shortLink: string
}

const NewLinkForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<NewLinkFormData>({
    mode: 'onChange',
    defaultValues: {
      originalLink: '',
      shortLink: '',
    },
  })

  const onSubmit = (data: NewLinkFormData) => {
    console.log('new-link-form', data)
  }

  return (
    <section className='w-full max-w-md rounded-2xl bg-gray-100 px-6 py-8 md:px-11 md:py-12 lg:max-w-[380px]'>
      <h1 className='text-xi text-gray-600'>Novo link</h1>

      <form
        className='mt-8 flex flex-col gap-7'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-3'>
          <label
            className='text-sm-semibold uppercase tracking-wide text-gray-500'
            htmlFor='originalLink'
          >
            Link original
          </label>
          <input
            id='originalLink'
            type='url'
            placeholder='www.exemplo.com.br'
            className='h-14 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 text-lg text-gray-400 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-base md:h-[68px] md:px-5 md:text-[38px] md:leading-[44px]'
            {...register('originalLink', { required: true })}
          />
        </div>

        <div className='flex flex-col gap-3'>
          <label
            className='text-sm-semibold uppercase tracking-wide text-gray-500'
            htmlFor='shortLink'
          >
            Link encurtado
          </label>
          <input
            id='shortLink'
            type='text'
            placeholder='brev.ly/'
            className='h-14 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 text-lg text-gray-400 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-base md:h-[68px] md:px-5 md:text-[38px] md:leading-[44px]'
            {...register('shortLink', { required: true })}
          />
        </div>

        <Button
          className='mt-2 h-12 w-full text-md-semibold md:h-[68px] md:text-lg-bold'
          disabled={!isValid}
          type='submit'
        >
          Salvar link
        </Button>
      </form>
    </section>
  )
}

export { NewLinkForm }
