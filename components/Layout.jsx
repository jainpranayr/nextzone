import Head from 'next/head'
import {
	Container,
	CssBaseline,
	ThemeProvider,
} from '@material-ui/core'
import Navbar from './Navbar'
import { createTheme } from '@material-ui/core'
import Footer from './Footer'

export default function Layout({ title, description, children }) {
	// dark and light theme styles
	const theme = createTheme({
		palette: {
			primary: {
				main: '#f0c000',
			},
			secondary: {
				main: '#208080',
			},
		},
	})

	return (
		<div className='flex flex-col min-h-screen'>
			{/* Dynamic title of page */}
			<Head>
				<title>{title ? `${title} - nextshop` : 'nextshop'}</title>
				{description && <meta name='description' content={description}></meta>}
			</Head>

			{/* Theme Context */}
			<ThemeProvider theme={theme}>
				{/* CSS Reset */}
				<CssBaseline />
				{/* Navbar */}

				<Navbar />
				{/* Main Content */}
				<Container className="flex-1">{children}</Container>

				{/* Footer */}
				<Footer />
			</ThemeProvider>
		</div>
	)
}
