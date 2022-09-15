import NextLink from 'next/link'

const Hero = () => {
	return (
		<div className='relative overflow-hidden bg-slate-900 full-bleed'>
			<div className='pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48'>
				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static'>
					<div className='sm:max-w-lg'>
						<h1 className='text-4xl tracking-tight font-extrabold text-white'>
						Wear what we are proud of.
						</h1>
					</div>
					<div>
						<div className='mt-5 overflow-hidden'>
							{/* Decorative image grid */}
							<div
								aria-hidden='true'
								className='pointer-events-none lg:absolute lg:inset-y-0 lg:max-w-7xl lg:mx-auto lg:w-full'>
								<div className='absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8'>
									<div className='flex items-center space-x-6 lg:space-x-8'>
										<div className='flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8'>
											<div className='w-44 h-64 rounded-lg overflow-hidden sm:opacity-0 lg:opacity-100'>
												<img
													src='https://i.postimg.cc/sDJj5VZt/hero-tile-01.jpg'
													alt=''
													className='w-full h-full object-center object-cover'
												/>
											</div>
											<div className='w-44 h-64 rounded-lg overflow-hidden'>
												<img
													src='https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-02.jpg'
													alt=''
													className='w-full h-full object-center object-cover'
												/>
											</div>
										</div>
										<div className='flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8'>
											<div className='w-44 h-64 rounded-lg overflow-hidden'>
												<img
													src='https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-03.jpg'
													alt=''
													className='w-full h-full object-center object-cover'
												/>
											</div>
											<div className='w-44 h-64 rounded-lg overflow-hidden'>
												<img
													src='https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-04.jpg'
													alt=''
													className='w-full h-full object-center object-cover'
												/>
											</div>
											<div className='w-44 h-64 rounded-lg overflow-hidden'>
												<img
													src='https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-05.jpg'
													alt=''
													className='w-full h-full object-center object-cover'
												/>
											</div>
										</div>
										<div className='flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8'>
											<div className='w-44 h-64 rounded-lg overflow-hidden'>
												<img
													src='https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-06.jpg'
													alt=''
													className='w-full h-full object-center object-cover'
												/>
											</div>
											<div className='w-44 h-64 rounded-lg overflow-hidden'>
												<img
													src='https://tailwindui.com/img/ecommerce-images/home-page-03-hero-image-tile-07.jpg'
													alt=''
													className='w-full h-full object-center object-cover'
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							<NextLink href='/search' passHref>
								<span className='inline-block text-center bg-indigo-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-indigo-700'>
									Explore Colllection
								</span>
							</NextLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Hero

// feel luxutious with premium quality outfits
