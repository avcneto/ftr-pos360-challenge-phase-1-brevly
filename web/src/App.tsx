import { MyLinks, NewLinkForm } from './components'
import logo from './assets/Logo.svg'

function App() {
  return (
    <main className='flex min-h-screen items-start justify-center bg-gray-300 px-4 pt-0 pb-8 md:items-center md:px-6 md:py-12'>
      <div className='mx-auto flex w-full max-w-[1400px] flex-col items-start justify-center md:items-center'>
        <div className='w-full max-w-md lg:max-w-[986px]'>
          <div className='mb-4 flex justify-center md:mb-8 lg:justify-start'>
            <img src={logo} alt='brev.ly' className='h-[24px] w-[96.67px]' />
          </div>

          <section className='flex w-full flex-col items-center justify-center gap-6 md:gap-8 lg:flex-row lg:items-start lg:justify-center'>
            <NewLinkForm />
            <MyLinks />
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
