import { Disclosure, Menu, Transition } from '@headlessui/react'
import {
	MenuIcon,
	SearchIcon,
	ShoppingBagIcon,
	XIcon,
} from '@heroicons/react/outline'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useContext, useState } from 'react'
import { Store } from '../config'
import { classNames } from '../utils'

const Navbar = ({ sticky }) => {
	// get state and dispatch from store
	const {
		state: {
			cart: { cartItems },
			userInfo,
		},
		dispatch,
	} = useContext(Store)
	// setup router
	const router = useRouter()

	// handle Logout
	const handleLogOut = () => {
		// dispatch logout event
		dispatch({ type: 'USER_LOGOUT' })
		// empty cookies
		Cookies.remove('userInfo')
		Cookies.remove('cartItems')
		// redirect to login page
		router.push('/login')
	}

	const [query, setQuery] = useState(router.query?.query || '')

	const handleQueryChange = e => {
		setQuery(e.target.value)
	}

	const handleSubmit = e => {
		e.preventDefault()
		router.push(`/search?query=${query}`)
	}
	return (
		<Disclosure
			as='nav'
			className={classNames(
				sticky ? 'sticky top-0' : '',
				'bg-slate-900 bg-opacity-90 backdrop-blur backdrop-filter z-40'
			)}>
			{({ open }) => (
				<>
					<div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-8'>
						<div className='relative flex h-16 md:h-20 lg:gap-x-4 justify-between items-center'>
							<div className='hidden md:flex px-2 lg:px-0'>
								<div className='flex-shrink-0 flex items-center cursor-pointer'>
									<NextLink href='/' passHref>
										<span className='font-bold text-white text-2xl'>
											nextzone
										</span>
									</NextLink>
								</div>
								<div className='hidden lg:block lg:ml-6'>
									<div className='flex space-x-4'>
										<NextLink href='/' passHref>
											<span
												className={classNames(
													router.pathname === '/'
														? 'bg-gray-900 text-white'
														: 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
												)}>
												Home
											</span>
										</NextLink>
										<NextLink href='/search' passHref>
											<span
												className={classNames(
													router.pathname === '/search'
														? 'bg-gray-900 text-white'
														: 'text-gray-300 hover:bg-gray-700 hover:text-white',
													'px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
												)}>
												Shop Now
											</span>
										</NextLink>
									</div>
								</div>
							</div>
							<div className='flex-1 flex justify-center items-center px-2 lg:ml-6 lg:justify-end'>
								<form
									className='max-w-lg w-full lg:max-w-xs'
									onSubmit={handleSubmit}>
									<label htmlFor='search' className='sr-only'>
										Search
									</label>
									<div className='relative'>
										<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
											<SearchIcon
												className='h-5 w-5 text-gray-400'
												aria-hidden='true'
											/>
										</div>
										<input
											id='search'
											name='search'
											className='block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm lg:max-w-sm'
											placeholder='Search'
											type='search'
											value={query}
											onChange={handleQueryChange}
										/>
									</div>
								</form>
							</div>
							<div className='flex items-center lg:hidden'>
								{/* Mobile menu button */}
								<Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-white'>
									<span className='sr-only'>Open main menu</span>
									{open ? (
										<XIcon className='block h-6 w-6' aria-hidden='true' />
									) : (
										<MenuIcon className='block h-6 w-6' aria-hidden='true' />
									)}
								</Disclosure.Button>
							</div>
							<div className='flex items-center'>
								<NextLink href='/cart' passHref>
									<button
										type='button'
										className='relative flex-shrink-0 p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-white rounded-md'>
										<span className='sr-only'>View notifications</span>
										<ShoppingBagIcon className='h-6 w-6' aria-hidden='true' />
										{cartItems.length > 0 && (
											<span className='absolute top-[2px] left-[18px] bg-red-600 rounded-full text-center text-white h-[18px] w-[18px] text-sm'>
												{cartItems.length}
											</span>
										)}
									</button>
								</NextLink>

								{/* Profile dropdown */}
								<Menu as='div' className='relative flex-shrink-0 z-40'>
									<div>
										<Menu.Button className='flex-shrink-0 text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-white hidden lg:flex flex-col ml-4 cursor-pointer'>
											<span className='text-gray-300 font-medium'>Hello,</span>
											{userInfo ? (
												<span className='font-medium text-white'>
													{userInfo.name}
												</span>
											) : (
												<NextLink href='/login' passHref>
													<span className='font-medium text-white'>
														Sign In
													</span>
												</NextLink>
											)}
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'>
										<Menu.Items className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
											<NextLink href='/profile' passHref>
												<Menu.Item>
													{({ active }) => (
														<button
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}>
															Your Profile
														</button>
													)}
												</Menu.Item>
											</NextLink>
											<NextLink href='/order-history' passHref>
												<Menu.Item>
													{({ active }) => (
														<button
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
															)}>
															Order History
														</button>
													)}
												</Menu.Item>
											</NextLink>
											<Menu.Item>
												{({ active }) => (
													<button
														className={classNames(
															active ? 'bg-gray-100' : '',
															'block px-4 py-2 text-sm text-gray-700 w-full text-left'
														)}
														onClick={handleLogOut}>
														Sign out
													</button>
												)}
											</Menu.Item>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					{/* Mobile Menu START */}
					<Disclosure.Panel className='lg:hidden'>
						<div className='pt-2 pb-3 space-y-1'>
							<NextLink href='/' passHref>
								<Disclosure.Button
									className={classNames(
										router.pathname === '/'
											? 'bg-gray-900 text-white'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'w-full text-left block px-3 py-2 text-base font-medium'
									)}>
									Home
								</Disclosure.Button>
							</NextLink>
							<NextLink href='/search' passHref>
								<Disclosure.Button
									className={classNames(
										router.pathname === '/search'
											? 'bg-gray-900 text-white'
											: 'text-gray-300 hover:bg-gray-700 hover:text-white',
										'w-full text-left block px-3 py-2 text-base font-medium'
									)}>
									Shop Now
								</Disclosure.Button>
							</NextLink>
						</div>
						<div className='pt-4 pb-3 border-t border-gray-700'>
							{userInfo ? (
								<>
									<div className='flex flex-col px-4'>
										<span className='text-base font-medium text-gray-300'>
											Hello,
										</span>
										<span className='text-base font-medium text-white'>
											{userInfo?.name}
										</span>
									</div>
									<div className='mt-3 space-y-1'>
										<Disclosure.Button
											as='a'
											href='/profile'
											className='block px-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
											Your Profile
										</Disclosure.Button>

										<Disclosure.Button
											as='a'
											href='/order-history'
											className='block px-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
											Order History
										</Disclosure.Button>

										<Disclosure.Button
											as='button'
											className='block px-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left'
											onClick={handleLogOut}>
											Sign out
										</Disclosure.Button>
									</div>
								</>
							) : (
								<div className='flex flex-col px-4'>
									<span className='text-base font-medium text-gray-300'>
										Hello,
									</span>
									<NextLink href='/login' passHref>
										<span className='text-base font-medium text-white'>
											Sign In
										</span>
									</NextLink>
								</div>
							)}
						</div>
					</Disclosure.Panel>
					{/* Mobile Menu END */}
				</>
			)}
		</Disclosure>
	)
}

export default Navbar
