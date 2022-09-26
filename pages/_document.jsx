import { ServerStyleSheets } from '@material-ui/core/styles'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang='en'>
				<Head>
					{/* roboto font */}
					<link
						rel='stylesheet'
						href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

MyDocument.getInitialProps = async ctx => {
	// get server style sheets
	const sheets = new ServerStyleSheets()
	const originalRenderPage = ctx.renderPage
	// change original render page to pass empty styles to server
	ctx.renderPage = () => {
		return originalRenderPage({
			enhanceApp: App => props => sheets.collect(<App {...props} />),
		})
	}

	// pass styles to render after loading page
	const initialProps = await Document.getInitialProps(ctx)
	return {
		...initialProps,
		styles: [
			...React.Children.toArray(initialProps.styles),
			sheets.getStyleElement(),
		],
	}
}
