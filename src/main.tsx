import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// The shared stylesheets load first so that a component's own rules (and its phone overrides)
// always come after the tokens they adjust.
import './styles/tokens.css'
import './styles/base.css'
import './styles/decay.css'
import App from './App.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Missing #root element in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
