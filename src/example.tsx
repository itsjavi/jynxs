import './example.css'

import { cleanupEffectQueues, JynxsRef, renderJSX, useEffect, useState } from './runtime/jsx-runtime'
import libLogo from '/icon.png'
import viteLogo from '/vite.svg'

const AsyncComponent = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay
  return (
    <div>
      <h2>Async Component Loaded!</h2>
      <p>This was loaded asynchronously after 2 seconds.</p>
    </div>
  )
}

const CounterWidget = ({ defaultValue = 10 }: { defaultValue: number }) => {
  const [count, setCount] = useState(defaultValue)

  useEffect(() => {
    console.log('useEffect: Component mounted!')

    return () => {
      console.log('useEffect: Cleanup on unmount')
    }
  }, [])

  return (
    <div class="flex-x">
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
      <div>Count: {count}</div>
    </div>
  )
}

const Demos = () => {
  const inputRef: JynxsRef<HTMLInputElement> = { current: null }

  const handleBtnClick = () => {
    if (inputRef.current) {
      alert(`inputRef.current.value = ${inputRef.current.value}`)
    }
  }

  return (
    <>
      <div class="flex-y">
        <div class="flex-x">
          <input ref={inputRef} placeholder="Type something..." />
          <button type="button" onClick={handleBtnClick}>
            Alert Input Value
          </button>
        </div>
        <CounterWidget defaultValue={0} />
      </div>
      <AsyncComponent fallback={<p>Loading async component...</p>} />
    </>
  )
}

const App = () => (
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite logo" />
    </a>
    <a href="https://github.com/itsjavi/jynxs" target="_blank" rel="noreferrer">
      <img src={libLogo} class="logo jynxs-logo" alt="TypeScript logo" />
    </a>
    <h1 key={123}>
      Vite +{' '}
      <a href="https://github.com/itsjavi/jynxs" target="_blank" rel="noreferrer">
        JynXS
      </a>
    </h1>
    <p class="description">
      JynXS is a lightweight, JSX runtime that implements the very basics of a modern UI library without relying on
      React.
      <br />
      <br />
      Examples:
    </p>
    <Demos />
  </div>
)

// Initial render
const appElement = document.getElementById('root')
if (!appElement) {
  throw new Error('No element with id "app" found')
}
renderJSX(<App />, appElement)

// Cleanup on window unload
window.addEventListener('beforeunload', cleanupEffectQueues)
