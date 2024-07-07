import React from 'react'
import '@radix-ui/themes/styles.css'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer, Flip } from 'react-toastify' // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css' // Import CSS của ToastContainer
export const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
        transition={Flip}
        stacked
      />
    </BrowserRouter>
  </React.StrictMode>
)
