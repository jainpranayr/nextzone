import Head from 'next/head'
import React from 'react'

const MyHead = ({ title, description, image, url }) => {
	return (
		<Head>
			<meta name='viewport' content='width=device-width' />
			<meta charSet='utf-8' />
			<link
				rel='icon'
				type='image/png'
				href='https://nextzone.vercel.app/images/logo.png'
			/>

			<title>
				{(title && title + ' - Nextzone') ||
					'Nextzone - Make your fashion more perfect.'}
			</title>
			{/* <!-- HTML Meta Tags --> */}
			<meta
				name='description'
				content={
					description ||
					'Shop for clothes online at Nextzone With our clothing collection, you can take your style to the next level.'
				}
			/>

			{/* <!-- Facebook Meta Tags --> */}
			<meta property='og:url' content={url || 'https://nextzone.vercel.app/'} />
			<meta property='og:type' content='website' />
			<meta property='og:locale' content='en_US' />
			<meta property='og:site_name' content='Nextzone' />
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
			<meta
				property='og:image'
				content={image || 'https://nextzone.vercel.app/images/logo.png'}
			/>

			{/* <!-- Twitter Meta Tags --> */}

			<meta name='twitter:card' content='summary' />
			<meta property='twitter:domain' content='nextzone.vercel.app' />
			<meta name='twitter:site' content='https://nextzone.vercel.app/' />
			<meta name='twitter:creator' content='@jpranay18' />
			<meta
				property='twitter:url'
				content={url || 'https://nextzone.vercel.app/'}
			/>
			<meta
				name='twitter:title'
				content={
					(title && title + ' - Nextzone') ||
					'Nextzone - Make your fashion more perfect.'
				}
			/>
			<meta
				name='twitter:description'
				content={
					description ||
					'Shop for clothes online at Nextzone With our clothing collection, you can take your style to the next level.'
				}
			/>
			<meta
				name='twitter:image'
				content={image || 'https://nextzone.vercel.app/images/logo.png'}
			/>

			<meta name='robots' content='index,follow' />
		</Head>
	)
}

export default MyHead
