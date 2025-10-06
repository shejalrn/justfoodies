import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#4BA3A8',
              color: '#fff',
              zIndex: 9999,
              marginTop: '80px',
              fontSize: '14px',
              padding: '12px 16px'
            },
            success: {
              style: {
                background: '#4BA3A8',
                color: '#fff'
              }
            },
            error: {
              style: {
                background: '#DE925B',
                color: '#fff'
              }
            }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)