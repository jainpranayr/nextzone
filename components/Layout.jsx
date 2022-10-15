import {
	Container,
	createTheme,
	CssBaseline,
	ThemeProvider,
} from '@material-ui/core'
import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({ children, sticky = true }) {
	// dark and light theme styles
	const theme = createTheme({
		palette: {
			primary: {
				main: '#4f46e5',
			},
			secondary: {
				main: '#208080',
			},
		},
	})

	return (
		<div className='flex flex-col min-h-screen bg-gray-50'>
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
