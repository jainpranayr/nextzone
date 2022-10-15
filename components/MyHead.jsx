import Head from 'next/head'
import React from 'react'

const MyHead = ({ title, description, image }) => {
	console.log('HEAD', description)
	return (
		<Head>
			<meta name='viewport' content='width=device-width' />
			<meta charSet='utf-8' />
			<meta
				name='twitter:image'
				content={image || 'https://nextzone.vercel.app/images/logo.svg'}
			/>

			<title>
				{(title && title + ' - Nextzone') ||
					'Nextzone - Make your fashion more perfect.'}
			</title>
			<meta
				name='description'
				content={
					description ||
					'Shop for clothes online at Nextzone With our clothing collection, you can take your style to the next level.'
				}
			/>
			<meta name='twitter:card' content='summary' />
			<meta name='twitter:site' content='https://nextzone.vercel.app/' />
			<meta name='twitter:creator' content='@jpranay18' />
			<meta
				property='og:title'
				content={
					(title && title + ' - Nextzone') ||
					'Nextzone - Make your fashion more perfect.'
				}
			/>
			<meta
				property='og:description'
				content={
					description ||
					'Shop for clothes online at Nextzone With our clothing collection, you can take your style to the next level.'
				}
			/>
			<meta property='og:url' content='https://nextzone.vercel.app/' />
			<meta property='og:type' content='website' />
			<meta
				property='og:image'
				content={image || 'https://nextzone.vercel.app/images/logo.svg'}
			/>
			<meta property='og:locale' content='en_US' />
			<meta property='og:site_name' content='Nextzone' />
			<meta name='robots' content='index,follow' />
		</Head>
	)
}

export default MyHead
