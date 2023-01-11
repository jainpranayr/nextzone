import NextNProgress from 'nextjs-progressbar'

import { Toaster } from 'react-hot-toast'
import { Layout } from '../components'
import { StoreProvider } from '../config'
import '../styles/globals.css'

import { Analytics } from '@vercel/analytics/react'

function MyApp({ Component, pageProps }) {
	return (
		<StoreProvider>
			<NextNProgress color='#4f46e5' height={4} />
			<Layout {...(Component.layout || {})}>
				<Component {...pageProps} />
			</Layout>
			<Analytics />
			<Toaster position='top-right' />
		</StoreProvider>
	)
}

export default MyApp
