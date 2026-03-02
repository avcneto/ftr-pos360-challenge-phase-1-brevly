const NotFound = () => {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-300 px-4'>
      <section className='flex h-auto w-full max-w-[580px] flex-col items-center gap-6 rounded-[8px] bg-gray-100 px-6 py-10 md:h-[329px] md:px-12 md:py-16'>
        <img src='/404.svg' alt='404' className='h-[56px] w-[128px]' />

        <h1 className='text-xi flex h-auto w-full max-w-full items-center justify-center text-center text-gray-600 md:h-[32px] md:max-w-[484px]'>
          Link não encontrado
        </h1>

        <p className='text-md-semibold flex h-auto w-full max-w-full items-center justify-center text-center text-gray-500 md:h-[36px] md:max-w-[484px]'>
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em brev.ly.
        </p>
      </section>
    </main>
  )
}

export { NotFound }
