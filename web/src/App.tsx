import { MyLinks, NewLinkForm } from './components'
import logo from './assets/Logo.svg'

function App() {
  return (
    <main className='min-h-screen bg-gray-300 px-4 py-8 md:px-6 md:py-12'>
      <div className='mx-auto flex w-full max-w-[1400px] flex-col items-center'>
        <img src={logo} alt='brev.ly' className='h-10 w-auto md:h-12' />

        <section className='mt-8 flex w-full flex-col items-center gap-6 md:mt-12 lg:flex-row lg:items-start lg:justify-center'>
          <NewLinkForm />
          <MyLinks />
        </section>
      </div>
    </main>
  )
}

export default App
