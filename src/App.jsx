import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LineDrawingApp from './LineDrawingApp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <LineDrawingApp />
    </div>
    
  )
}

export default App
