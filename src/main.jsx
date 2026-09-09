import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { OrgsProvider } from './context/OrgsContext'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrgsProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </OrgsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
