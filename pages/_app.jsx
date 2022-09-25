import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import NextNProgress from 'nextjs-progressbar'
import { SnackbarProvider } from 'notistack'
import { useEffect } from 'react'
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
		// wrap in Snackbar Provider
		<SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
			{/* wrap component in Store provider */}
			<StoreProvider>
				{/* wrap component in paypal provider */}
				<PayPalScriptProvider>
					<NextNProgress color='#4f46e5' height={4} />
					<Component {...pageProps} />
				</PayPalScriptProvider>
			</StoreProvider>
		</SnackbarProvider>
	)
}

export default MyApp
