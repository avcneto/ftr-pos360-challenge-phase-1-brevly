import { Button, IconButton } from './ui'
import copyIcon from './assets/Copy.svg'

function App() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-gray-100 px-6 py-10'>
      <Button disabled onClick={() => alert('Button clicked!')}>
        Click me
      </Button>
      <IconButton
        icon={copyIcon}
        label='Icon Button'
        onClick={() => alert('Icon Button clicked!')}
      />
    </main>
  )
}

export default App
