import { useEffect } from 'react'
import { StoreProvider } from '../config'
import { SnackbarProvider } from 'notistack'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // remove css for ssr
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    // wrap in Snackbar Provider
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      {/* wrap component in Store provider */}
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SnackbarProvider>
  )
}

export default MyApp
