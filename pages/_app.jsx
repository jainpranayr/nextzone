import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import NextNProgress from 'nextjs-progressbar'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
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
			<PayPalScriptProvider>
				<NextNProgress color='#4f46e5' height={4} />
				<Component {...pageProps} />
				<Toaster position='top-right' />
			</PayPalScriptProvider>
		</StoreProvider>
	)
}

export default MyApp
