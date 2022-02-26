import { useEffect } from 'react'
import { StoreProvider } from '../config/store'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // remove css for ssr
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    // wrap component in provider
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  )
}

export default MyApp
