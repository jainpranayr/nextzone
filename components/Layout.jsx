import Head from 'next/head'
import {
	Typography,
	Container,
	CssBaseline,
	ThemeProvider,
} from '@material-ui/core'
import { useStyles } from '../utils'

import Navbar from './Navbar'
import { createTheme } from '@material-ui/core'

export default function Layout({ title, description, children }) {
	// get styles
	const classes = useStyles()
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
		<div>
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
				<Container className={classes.main}>{children}</Container>

				{/* Footer */}
				<footer className={classes.footer}>
					<Typography>All rights reserved. nextshop.</Typography>
				</footer>
			</ThemeProvider>
		</div>
	)
}
