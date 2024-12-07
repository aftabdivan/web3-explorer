import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'

import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      closeButton={false}
      pauseOnHover
      limit={1}
    />
    <App />
  </React.StrictMode>
)

// Register the service worker for offline support (PWA functionality)
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('Service worker registered successfully!')
  },
  onError: (error: Error) => {
    console.error('Service worker registration failed:', error)
  },
})
