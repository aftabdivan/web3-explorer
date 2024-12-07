// This is a basic service worker registration file for CRA-based apps with TypeScript.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/127(\.[0-9]{1,3}){3}$/)
)

export function register(config?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      return
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

      if (isLocalhost) {
        // This is localhost: Make sure we are not using an old version of the service worker.
        checkValidServiceWorker(swUrl, config)
      } else {
        // Register a service worker.
        registerValidSW(swUrl, config)
      }
    })
  }
}

function registerValidSW(
  swUrl: string,
  config?: { onSuccess?: () => void; onError?: (error: Error) => void }
) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available, please refresh.
              console.log('New content is available, please refresh.')
              if (config && config.onSuccess) {
                config.onSuccess()
              }
            } else {
              // Content is cached for offline use.
              console.log('Content is cached for offline use.')
              if (config && config.onSuccess) {
                config.onSuccess()
              }
            }
          }
        }
      }
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error)
      if (config && config.onError) {
        config.onError(error)
      }
    })
}

function checkValidServiceWorker(
  swUrl: string,
  config?: { onSuccess?: () => void; onError?: (error: Error) => void }
) {
  fetch(swUrl)
    .then((response) => {
      // Ensure the service worker exists and can be fetched.
      if (
        response.status === 404 ||
        response.headers.get('content-type')?.indexOf('javascript') === -1
      ) {
        // Service worker not found. Unregister any existing service workers.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister()
        })
      } else {
        // Register the service worker.
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    })
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}
