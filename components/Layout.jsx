import Footer from './Footer'
import Navbar from './Navbar'

export default function Layout({ children, sticky = true }) {
	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			{/* Theme Context */}
			{/* Navbar */}
			<Navbar sticky={sticky} />
			{/* Main Content */}
			<div className='flex-1 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				{children}
			</div>
			{/* Footer */}
			<Footer />
		</div>
	)
}
