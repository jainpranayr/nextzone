import NextNProgress from 'nextjs-progressbar'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Layout } from '../components'
import { StoreProvider } from '../config'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		// remove css for ssr
		const jssStyles = document.querySelector('#jss-server-side')
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles)
		}
	}, [])

	return (
		<StoreProvider>
			<NextNProgress color='#4f46e5' height={4} />
			<Layout {...(Component.layout || {})}>
				<Component {...pageProps} />
			</Layout>
			<Toaster position='top-right' />
		</StoreProvider>
	)
}

export default MyApp
