import NextLink from 'next/link'
import { useContext, useState, Fragment } from 'react'
import { Store } from '../config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Disclosure, Transition, Menu } from '@headlessui/react'
import {
	ShoppingBagIcon,
	XIcon,
	MenuIcon,
	SearchIcon,
} from '@heroicons/react/outline'

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
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

	const [query, setQuery] = useState('')

	const handleQueryChange = e => {
		setQuery(e.target.value)
	}

	const handleSubmit = e => {
		e.preventDefault()
		router.push(`/search?query=${query}`)
	}
	return (
			<Disclosure as='nav' className='bg-white shadow'>
				{({ open }) => (
					<>
						<div className='max-w-7xl mx-auto px-2 sm:px-4 lg:px-8'>
							<div className='flex h-16 lg:gap-x-4'>
								<div className='hidden lg:flex px-2 lg:px-0'>
									<div className='flex-shrink-0 flex items-center cursor-pointer'>
										<NextLink href='/' passHref>
											<span className='font-bold text-indigo-800 text-2xl'>
												nextzone
											</span>
										</NextLink>
									</div>
								</div>
								<div className='flex-1 flex items-center justify-center px-2'>
									<form className='w-full' onSubmit={handleSubmit}>
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
												className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												placeholder='Search'
												type='search'
												onChange={handleQueryChange}
											/>
										</div>
									</form>
								</div>
								<div className='flex items-center lg:hidden'>
									{/* Mobile menu button */}
									<Disclosure.Button className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
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
											className='relative flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
											<span className='sr-only'>View notifications</span>
											<ShoppingBagIcon className='h-6 w-6' aria-hidden='true' />
											{cartItems.length > 0 && (
												<span className='absolute top-0 left-[15px] bg-red-700 rounded-full text-center text-white h-[18px] w-[18px] text-sm'>
													{cartItems.length}
												</span>
											)}
										</button>
									</NextLink>

									{/* Profile dropdown */}
									<Menu as='div' className='relative flex-shrink-0 z-50'>
										<div>
											<Menu.Button className='flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hidden lg:flex flex-col ml-4 cursor-pointer'>
												<span className='text-gray-500'>Hello,</span>
												{userInfo ? (
													<span className='font-medium text-gray-800'>
														{userInfo.name}
													</span>
												) : (
													<NextLink href='/login' passHref>
														<span className='font-medium text-gray-800'>
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
															<a
																className={classNames(
																	active ? 'bg-gray-100' : '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}>
																Your Profile
															</a>
														)}
													</Menu.Item>
												</NextLink>
												<NextLink href='/order-history' passHref>
													<Menu.Item>
														{({ active }) => (
															<a
																className={classNames(
																	active ? 'bg-gray-100' : '',
																	'block px-4 py-2 text-sm text-gray-700'
																)}>
																Order History
															</a>
														)}
													</Menu.Item>
												</NextLink>
												<Menu.Item>
													{({ active }) => (
														<button
															className={classNames(
																active ? 'bg-gray-100' : '',
																'block px-4 py-2 text-sm text-gray-700'
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
							<div className='pt-4 pb-3 border-t border-gray-200'>
								{userInfo ? (
									<>
										<div className='flex flex-col px-4'>
											<span className='text-base font-medium text-gray-500'>
												Hello,
											</span>
											<span className='text-base font-medium text-gray-800'>
												{userInfo?.name}
											</span>
										</div>
										<div className='mt-3 space-y-1'>
											<Disclosure.Button
												as='a'
												href='/profile'
												className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'>
												Your Profile
											</Disclosure.Button>

											<Disclosure.Button
												as='a'
												href='/order-history'
												className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'>
												Order History
											</Disclosure.Button>

											<Disclosure.Button
												as='button'
												className='block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100'
												onClick={handleLogOut}>
												Sign out
											</Disclosure.Button>
										</div>
									</>
								) : (
									<div className='flex flex-col px-4'>
										<span className='text-base font-medium text-gray-500'>
											Hello,
										</span>
										<NextLink
											href='/login'
											className='text-base font-medium text-gray-800'>
											Sign In
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
