import {
	Container,
	createTheme,
	CssBaseline,
	ThemeProvider,
} from '@material-ui/core'
import Head from 'next/head'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({
	title,
	description,
	children,
	sticky = true,
}) {
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
		<div className='flex flex-col min-h-screen bg-gray-50'>
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

				<Navbar sticky={sticky} />
				{/* Main Content */}
				<Container className='flex-1'>{children}</Container>

				{/* Footer */}
				<Footer />
			</ThemeProvider>
		</div>
	)
}
