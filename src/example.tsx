import './example.css'

import { cleanup, renderJSX, useEffect, useState } from './runtime/jsx-runtime'
import libLogo from '/icon.png'
import viteLogo from '/vite.svg'
// Async component
const AsyncComponent = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay
  return (
    <div>
      <h2>Async Component Loaded!</h2>
      <p>This was loaded asynchronously after 2 seconds.</p>
    </div>
  )
}

const App = () => {
  const [count, setCount] = useState(0)
  const inputRef = { current: null as HTMLInputElement | null }

  useEffect(() => {
    console.log('Component mounted!')

    return () => {
      console.log('Cleanup on unmount')
    }
  }, [])

  const handleClick = () => {
    if (inputRef.current) {
      alert(`Input value: ${inputRef.current.value}`)
    }
  }

  return (
    <div>
      <a href="https://vitejs.dev" target="_blank">
        <img src={viteLogo} class="logo" alt="Vite logo" />
      </a>
      <a href="https://github.com/itsjavi/jynxs" target="_blank">
        <img src={libLogo} class="logo vanilla" alt="TypeScript logo" />
      </a>
      <h1 key={123}>Vite + JynXS</h1>
      <input ref={inputRef} placeholder="Type something..." />
      <button onClick={handleClick}>Alert Input Value</button>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <AsyncComponent fallback={<p>Loading async component...</p>} />
    </div>
  )
}

// Initial render
renderJSX(<App />, document.getElementById('app')!)

// Cleanup on window unload
window.addEventListener('beforeunload', cleanup)
