import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100 px-6 py-10'>
      <section className='w-full max-w-md rounded-xl border border-gray-300 bg-white p-6 shadow-sm'>
        <h1>Hello world</h1>
      </section>
    </main>
  )
}

export default App
