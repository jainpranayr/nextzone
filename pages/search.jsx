import {
	Dialog,
	Disclosure,
	Menu,
	Popover,
	Transition,
} from '@headlessui/react'
import { ChevronDownIcon, StarIcon, XIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { MyHead, ProductsGrid } from '../components'
import SearchIcon from '../public/images/search.svg'
import { classNames } from '../utils'
import { db } from '/config'
import { Product } from '/models'
import { prices, ratings } from '/utils'

const PAGE_SIZE = 8

export default function Search({
	products,
	categories,
	brands,
	pages,
	countProducts,
}) {
	const router = useRouter()
	const [open, setOpen] = useState(false)

	const {
		category = 'all',
		brand = 'all',
		price = 'all',
		rating = 'all',
		sort = 'newest',
	} = router.query

	const filter = ({
		page,
		category,
		brand,
		sort,
		min,
		max,
		searchQuery,
		price,
		rating,
	}) => {
		const path = router.pathname
		const { query } = router
		if (page) query.page = page
		if (searchQuery) query.searchQuery = searchQuery
		if (sort) query.sort = sort
		if (category) query.category = category
		if (brand) query.brand = brand
		if (price) query.price = price
		if (rating) query.rating = rating
		if (min) query.min ? query.min : query.min === 0 ? 0 : min
		if (max) query.max ? query.max : query.max === 0 ? 0 : max

		router.push({
			pathname: path,
			query: query,
		})
	}

	const categoryHandler = e => {
		filter({ category: e.target.value, page: 1 })
	}
	const brandHandler = e => {
		filter({ brand: e.target.value, page: 1 })
	}
	const sortHandler = e => {
		filter({ sort: e.target.value, page: 1 })
	}
	const priceHandler = e => {
		filter({ price: e.target.value, page: 1 })
	}
	const ratingHandler = option => {
		filter({ rating: option, page: 1 })
	}

	return (
		<div>
			<MyHead
				title='Search'
				description='Brouse through our collection of apparel'
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>
			<div className='sticky top-0 p-4 z-10 bg-white border-b border-gray-200 mb-4'>
				<Transition.Root show={open} as={Fragment}>
					<Dialog
						as='div'
						className='fixed inset-0 flex z-40 sm:hidden'
						onClose={setOpen}>
						<Transition.Child
							as={Fragment}
							enter='transition-opacity ease-linear duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='transition-opacity ease-linear duration-300'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'>
							<Dialog.Overlay className='fixed inset-0 bg-black bg-opacity-25' />
						</Transition.Child>

						<Transition.Child
							as={Fragment}
							enter='transition ease-in-out duration-300 transform'
							enterFrom='translate-x-full'
							enterTo='translate-x-0'
							leave='transition ease-in-out duration-300 transform'
							leaveFrom='translate-x-0'
							leaveTo='translate-x-full'>
							<div className='ml-auto relative w-64 h-full bg-white shadow-xl py-4 pb-12 flex flex-col overflow-y-auto'>
								<div className='px-4 flex items-center justify-between'>
									<h2 className='text-lg font-medium text-gray-900'>Filters</h2>
									<button
										type='button'
										className='-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400'
										onClick={() => setOpen(false)}>
										<span className='sr-only'>Close menu</span>
										<XIcon className='h-6 w-6' aria-hidden='true' />
									</button>
								</div>
								{categories && (
									<Disclosure as='div' className='border-t border-gray-200 p-4'>
										{({ open }) => (
											<>
												<h3 className='-mx-2 -my-3 flow-root'>
													<Disclosure.Button className='px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400'>
														<span
															className={classNames(
																category !== 'all'
																	? 'text-indigo-600'
																	: 'text-gray-900',
																'font-medium'
															)}>
															Categories
														</span>
														<span className='ml-6 flex items-center'>
															<ChevronDownIcon
																className={classNames(
																	open ? '-rotate-180' : 'rotate-0',
																	'h-5 w-5 transform'
																)}
																aria-hidden='true'
															/>
														</span>
													</Disclosure.Button>
												</h3>
												<Disclosure.Panel className='pt-6'>
													<div className='space-y-6'>
														<button
															value='all'
															onClick={categoryHandler}
															className={classNames(
																category === 'all'
																	? 'text-indigo-500 hover:text-indigo-600 font-medium'
																	: 'hover:text-gray-900 text-gray-700',
																'border-gray-300 rounded focus:ring-indigo-500 text-sm whitespace-nowrap w-full text-left '
															)}>
															All
														</button>
														{categories.map((option, idx) => (
															<div key={idx} className='flex items-center'>
																<button
																	value={option}
																	onClick={categoryHandler}
																	className={classNames(
																		category === option
																			? 'text-indigo-500 hover:text-indigo-600 font-medium'
																			: 'hover:text-gray-900 text-gray-700',
																		'border-gray-300 rounded focus:ring-indigo-500 text-sm whitespace-nowrap w-full text-left '
																	)}>
																	{option}
																</button>
															</div>
														))}
													</div>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								)}

								{brands && (
									<Disclosure as='div' className='border-t border-gray-200 p-4'>
										{({ open }) => (
											<>
												<h3 className='-mx-2 -my-3 flow-root'>
													<Disclosure.Button className='px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400'>
														<span
															className={classNames(
																brand !== 'all'
																	? 'text-indigo-500'
																	: 'to-gray-900',
																'font-medium text-gray-900'
															)}>
															Brands
														</span>
														<span className='ml-6 flex items-center'>
															<ChevronDownIcon
																className={classNames(
																	open ? '-rotate-180' : 'rotate-0',
																	'h-5 w-5 transform'
																)}
																aria-hidden='true'
															/>
														</span>
													</Disclosure.Button>
												</h3>
												<Disclosure.Panel className='pt-6'>
													<div className='space-y-6'>
														<button
															value='all'
															onClick={brandHandler}
															className={classNames(
																brand === 'all'
																	? 'text-indigo-500 hover:text-indigo-600 font-medium'
																	: 'text-gray-700 hover:text-gray-900',
																'border-gray-300 rounded focus:ring-indigo-500 text-sm  whitespace-nowrap  w-full text-left'
															)}>
															All
														</button>
														{brands.map((option, idx) => (
															<div key={idx} className='flex items-center'>
																<button
																	value={option}
																	onClick={brandHandler}
																	className={classNames(
																		brand === option
																			? 'text-indigo-500 hover:text-indigo-600 font-medium'
																			: 'text-gray-700 hover:text-gray-900',
																		'border-gray-300 rounded focus:ring-indigo-500 text-sm  whitespace-nowrap  w-full text-left'
																	)}>
																	{option}
																</button>
															</div>
														))}
													</div>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								)}

								{prices && (
									<Disclosure as='div' className='border-t border-gray-200 p-4'>
										{({ open }) => (
											<>
												<h3 className='-mx-2 -my-3 flow-root'>
													<Disclosure.Button className='px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400'>
														<span
															className={classNames(
																price !== 'all'
																	? 'text-indigo-500'
																	: 'text-gray-900',
																'font-medium'
															)}>
															Prices
														</span>
														<span className='ml-6 flex items-center'>
															<ChevronDownIcon
																className={classNames(
																	open ? '-rotate-180' : 'rotate-0',
																	'h-5 w-5 transform'
																)}
																aria-hidden='true'
															/>
														</span>
													</Disclosure.Button>
												</h3>
												<Disclosure.Panel className='pt-6'>
													<div className='space-y-6'>
														<button
															value='all'
															onClick={priceHandler}
															className={classNames(
																price === 'all'
																	? 'text-indigo-500 hover:text-indigo-600 font-medium'
																	: 'text-gray-700 hover:text-gray-900',
																'border-gray-300 rounded focus:ring-indigo-500 text-sm  whitespace-nowrap  w-full text-left'
															)}>
															All
														</button>
														{prices.map((option, idx) => (
															<div key={idx} className='flex items-center'>
																<button
																	value={option.value}
																	onClick={priceHandler}
																	className={classNames(
																		price === option.value
																			? 'text-indigo-500 hover:text-indigo-600 font-medium'
																			: 'text-gray-700 hover:text-gray-900',
																		'border-gray-300 rounded focus:ring-indigo-500 text-sm  whitespace-nowrap  w-full text-left'
																	)}>
																	{option.name}
																</button>
															</div>
														))}
													</div>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								)}

								{ratings && (
									<Disclosure as='div' className='border-t border-gray-200 p-4'>
										{({ open }) => (
											<>
												<h3 className='-mx-2 -my-3 flow-root'>
													<Disclosure.Button className='px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400'>
														<span
															className={classNames(
																rating !== 'all'
																	? 'text-indigo-500'
																	: 'text-gray-900',
																'font-medium'
															)}>
															Ratings
														</span>
														<span className='ml-6 flex items-center'>
															<ChevronDownIcon
																className={classNames(
																	open ? '-rotate-180' : 'rotate-0',
																	'h-5 w-5 transform'
																)}
																aria-hidden='true'
															/>
														</span>
													</Disclosure.Button>
												</h3>
												<Disclosure.Panel className='pt-6'>
													<div className='space-y-6'>
														<button
															value='all'
															onClick={() => ratingHandler('all')}
															className={classNames(
																rating === 'all'
																	? 'text-indigo-500 hover:text-indigo-600 font-medium'
																	: 'text-gray-700 hover:text-gray-900',
																'border-gray-300 rounded focus:ring-indigo-500 text-sm  whitespace-nowrap  w-full text-left'
															)}>
															All
														</button>
														{ratings?.map((option, idx) => (
															<div key={idx} className='flex items-center'>
																<button
																	value={option}
																	onClick={() => ratingHandler(option)}
																	className='border-gray-300 rounded focus:ring-indigo-500 whitespace-nowrap hover:bg-gray-100 w-full text-left'>
																	<div className='flex items-center gap-x-1'>
																		<div className='flex items-center'>
																			{[0, 1, 2, 3].map(rating => (
																				<StarIcon
																					key={rating}
																					className={classNames(
																						option > rating
																							? 'text-indigo-500'
																							: 'text-gray-300',
																						'h-5 w-5 flex-shrink-0'
																					)}
																				/>
																			))}
																		</div>
																		<span
																			className={classNames(
																				option == rating
																					? 'text-indigo-500 hover:text-indigo-600 font-medium'
																					: 'text-gray-700 hover:text-gray=900'
																			)}>
																			&amp; Up
																		</span>
																	</div>
																</button>
															</div>
														))}
													</div>
												</Disclosure.Panel>
											</>
										)}
									</Disclosure>
								)}
							</div>
						</Transition.Child>
					</Dialog>
				</Transition.Root>

				<section aria-labelledby='filter-heading'>
					<h2 id='filter-heading' className='sr-only'>
						Filters
					</h2>
					<div className=''>
						<div className='max-w-7xl mx-auto px-4 flex items-center justify-between sm:px-6 lg:px-8'>
							<Menu as='div' className='relative inline-block text-left'>
								<div>
									<Menu.Button className='group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
										Sort
										<ChevronDownIcon
											className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500'
											aria-hidden='true'
										/>
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
									<Menu.Items className='origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
										<div className='py-1'>
											<Menu.Item>
												{() => (
													<button
														value='newest'
														className={classNames(
															sort === 'newest'
																? 'bg-gray-100 text-indigo-500 hover:to-indigo-600 font-medium'
																: 'to-gray-700 hover:to-gray-900',
															'block px-4 py-2 text-sm w-full text-left'
														)}
														onClick={sortHandler}>
														Newest arrivals
													</button>
												)}
											</Menu.Item>
											<Menu.Item>
												{() => (
													<button
														value='toprated'
														className={classNames(
															sort === 'toprated'
																? 'bg-gray-100 text-indigo-500 hover:to-indigo-600 font-medium'
																: 'to-gray-700 hover:to-gray-900',
															'block px-4 py-2 text-sm w-full text-left'
														)}
														onClick={sortHandler}>
														Customer Reviews
													</button>
												)}
											</Menu.Item>
											<Menu.Item>
												{() => (
													<button
														value='lowest'
														className={classNames(
															sort === 'lowest'
																? 'bg-gray-100 text-indigo-500 hover:to-indigo-600 font-medium'
																: 'to-gray-700 hover:to-gray-900',
															'block px-4 py-2 text-sm w-full text-left'
														)}
														onClick={sortHandler}>
														Price: Low to Hign
													</button>
												)}
											</Menu.Item>
											<Menu.Item>
												{() => (
													<button
														value='highest'
														className={classNames(
															sort === 'highest'
																? 'bg-gray-100 text-indigo-500 hover:to-indigo-600 font-medium'
																: 'to-gray-700 hover:to-gray-900',
															'block px-4 py-2 text-sm w-full text-left'
														)}
														onClick={sortHandler}>
														Price: High to Low
													</button>
												)}
											</Menu.Item>
										</div>
									</Menu.Items>
								</Transition>
							</Menu>

							<button
								type='button'
								className={classNames(
									category !== 'all' ||
										brand !== 'all' ||
										rating !== 'all' ||
										price !== 'all'
										? 'text-indigo-600'
										: 'text-gray-700 hover:text-gray-900 ',
									'inline-block text-sm font-medium sm:hidden'
								)}
								onClick={() => setOpen(true)}>
								Filters
							</button>

							<div className='hidden sm:block'>
								<div className='flow-root'>
									<Popover.Group className='-mx-4 flex items-center divide-x divide-gray-200'>
										<Popover className='px-4 relative inline-block text-left'>
											<Popover.Button className='group inline-flex justify-center text-sm font-medium'>
												<span
													className={classNames(
														category !== 'all'
															? 'text-indigo-500 hover:text-indigo-600'
															: 'text-gray-700 hover:text-gray-900'
													)}>
													Categories
												</span>
												<ChevronDownIcon
													className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500'
													aria-hidden='true'
												/>
											</Popover.Button>

											<Transition
												as={Fragment}
												enter='transition ease-out duration-100'
												enterFrom='transform opacity-0 scale-95'
												enterTo='transform opacity-100 scale-100'
												leave='transition ease-in duration-75'
												leaveFrom='transform opacity-100 scale-100'
												leaveTo='transform opacity-0 scale-95'>
												<Popover.Panel className='origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
													<button
														value='all'
														onClick={categoryHandler}
														className={classNames(
															category === 'all'
																? 'text-indigo-500 hover:text-indigo-600 font-medium'
																: 'text-gray-700 hover:text-gray-900',
															'border-gray-300 focus:ring-indigo-500 text-sm whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'
														)}>
														All
													</button>
													{categories.map((option, optionIdx) => (
														<button
															key={optionIdx}
															value={option}
															onClick={categoryHandler}
															className={classNames(
																category === option
																	? 'text-indigo-500 hover:text-indigo-600 font-medium'
																	: 'text-gray-700 hover:text-gray-900',
																'border-gray-300 focus:ring-indigo-500 text-sm whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'
															)}>
															{option}
														</button>
													))}
												</Popover.Panel>
											</Transition>
										</Popover>

										<Popover className='px-4 relative inline-block text-left'>
											<Popover.Button className='group inline-flex justify-center text-sm font-medium'>
												<span
													className={classNames(
														brand !== 'all'
															? 'text-indigo-500 hover:text-indigo-600'
															: 'text-gray-700 hover:text-gray-900'
													)}>
													Brands
												</span>
												<ChevronDownIcon
													className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500'
													aria-hidden='true'
												/>
											</Popover.Button>

											<Transition
												as={Fragment}
												enter='transition ease-out duration-100'
												enterFrom='transform opacity-0 scale-95'
												enterTo='transform opacity-100 scale-100'
												leave='transition ease-in duration-75'
												leaveFrom='transform opacity-100 scale-100'
												leaveTo='transform opacity-0 scale-95'>
												<Popover.Panel className='origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
													<button
														value='all'
														onClick={brandHandler}
														className={classNames(
															brand === 'all'
																? 'text-indigo-500 hover:text-indigo-600'
																: 'text-gray-700 hover:text-gray-900',
															'border-gray-300 focus:ring-indigo-500 text-sm whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'
														)}>
														All
													</button>
													{brands.map((option, optionIdx) => (
														<button
															key={optionIdx}
															value={option}
															onClick={brandHandler}
															className={classNames(
																brand === option
																	? 'text-indigo-500 hover:text-indigo-600'
																	: 'text-gray-700 hover:text-gray-900',
																'border-gray-300 focus:ring-indigo-500 text-sm whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'
															)}>
															{option}
														</button>
													))}
												</Popover.Panel>
											</Transition>
										</Popover>

										<Popover className='px-4 relative inline-block text-left'>
											<Popover.Button className='group inline-flex justify-center text-sm font-medium'>
												<span
													className={classNames(
														price !== 'all'
															? 'text-indigo-500 hover:text-indigo-600'
															: 'text-gray-700 hover:text-gray-900'
													)}>
													Prices
												</span>
												<ChevronDownIcon
													className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500'
													aria-hidden='true'
												/>
											</Popover.Button>

											<Transition
												as={Fragment}
												enter='transition ease-out duration-100'
												enterFrom='transform opacity-0 scale-95'
												enterTo='transform opacity-100 scale-100'
												leave='transition ease-in duration-75'
												leaveFrom='transform opacity-100 scale-100'
												leaveTo='transform opacity-0 scale-95'>
												<Popover.Panel className='origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
													<button
														value='all'
														onClick={priceHandler}
														className={classNames(
															price === 'all'
																? 'text-indigo-500 hover:text-indigo-600'
																: 'text-gray-700 hover:text-gray-900',
															'border-gray-300 focus:ring-indigo-500 text-sm whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'
														)}>
														All
													</button>
													{prices.map((option, optionIdx) => (
														<button
															key={optionIdx}
															value={option.value}
															onClick={priceHandler}
															className={classNames(
																price === option.value
																	? 'text-indigo-500 hover:text-indigo-600'
																	: 'text-gray-700 hover:text-gray-900',
																'border-gray-300 focus:ring-indigo-500 text-sm whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'
															)}>
															{option.name}
														</button>
													))}
												</Popover.Panel>
											</Transition>
										</Popover>

										<Popover className='px-4 relative inline-block text-left'>
											<Popover.Button className='group inline-flex justify-center text-sm font-medium'>
												<span
													className={classNames(
														rating !== 'all'
															? 'text-indigo-500 hover:text-indigo-600'
															: 'text-gray-700 hover:text-gray-900'
													)}>
													Ratings
												</span>
												<ChevronDownIcon
													className='flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500'
													aria-hidden='true'
												/>
											</Popover.Button>

											<Transition
												as={Fragment}
												enter='transition ease-out duration-100'
												enterFrom='transform opacity-0 scale-95'
												enterTo='transform opacity-100 scale-100'
												leave='transition ease-in duration-75'
												leaveFrom='transform opacity-100 scale-100'
												leaveTo='transform opacity-0 scale-95'>
												<Popover.Panel className='origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
													<button
														value='all'
														onClick={() => ratingHandler('all')}
														className={classNames(
															rating === 'all'
																? 'text-indigo-500 hover:text-indigo-600'
																: 'text-gray-700 hover:text-gray-900',
															'border-gray-300 focus:ring-indigo-500 text-sm font-medium text-gray-900 whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'
														)}>
														All
													</button>
													{ratings.map((option, optionIdx) => (
														<button
															key={optionIdx}
															value={option}
															onClick={() => ratingHandler(option)}
															className='border-gray-300 focus:ring-indigo-500 text-sm font-medium text-gray-900 whitespace-nowrap hover:bg-gray-100 py-2 px-4 w-full'>
															<span className='flex items-center gap-x-1'>
																<div className='flex items-center'>
																	{[0, 1, 2, 3].map(rating => (
																		<StarIcon
																			key={rating}
																			className={classNames(
																				option > rating
																					? 'text-indigo-500'
																					: 'text-gray-300',
																				'h-5 w-5 flex-shrink-0'
																			)}
																		/>
																	))}
																</div>
																<span
																	className={classNames(
																		rating == option
																			? 'text-indigo-500 hover:text-indigo-600'
																			: 'text-gray-700 hover:text-gray-900'
																	)}>
																	&amp; Up
																</span>
															</span>
														</button>
													))}
												</Popover.Panel>
											</Transition>
										</Popover>
									</Popover.Group>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
			{countProducts <= 0 ? (
				<div className='flex flex-col items-center justify-center text-center h-[calc(100vh-258px)] w-full'>
					<img
						src={SearchIcon.src}
						alt=''
						className='w-60 h-40 md:w-81 animate-wiggle object-cover object-center'
					/>
					<div className='ml-3 mt-3 space-y-1'>
						<h1 className='text-gray-800 text-lg font-medium'>
							No products found.
						</h1>
						<p className='text-gray-600 text-sm'>Please relax your filters</p>
					</div>
				</div>
			) : (
				<ProductsGrid products={products} className='border' />
			)}

			<nav className='border-t border-gray-200 px-4 flex items-center justify-center sm:px-0 mb-4'>
				<div className='flex'>
					{Array.from({ length: pages }).map((_, index) => (
						<button
							key={index}
							onClick={() => filter({ page: index + 1 })}
							className={classNames(
								index + 1 === parseInt(router.query.page || '1') &&
									'border-indigo-500 text-indigo-600',
								'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium'
							)}>
							{index + 1}
						</button>
					))}
				</div>
			</nav>
		</div>
	)
}

Search.layout = {
	sticky: false,
}

export async function getServerSideProps({ query }) {
	await db.connect()
	const pageSize = query.pageSize || PAGE_SIZE
	const page = query.page || 1
	const category = query.category || ''
	const brand = query.brand || ''
	const price = query.price || ''
	const rating = query.rating || ''
	const sort = query.sort || ''
	const searchQuery = query.query || ''

	const queryFilter =
		searchQuery && searchQuery !== 'all'
			? {
					name: {
						$regex: searchQuery,
						$options: 'i',
					},
			  }
			: {}

	const categoryFilter = category && category !== 'all' ? { category } : {}

	const brandFilter = brand && brand !== 'all' ? { brand } : {}

	const ratingFilter =
		rating && rating !== 'all'
			? {
					rating: {
						$gte: Number(rating),
					},
			  }
			: {}

	const priceFilter =
		price && price !== 'all'
			? price.split('-').length !== 1
				? {
						price: {
							$gte: Number(price.split('-')[0]),
							$lte: Number(price.split('-')[1]),
						},
				  }
				: { price: { $gt: Number(price) } }
			: {}

	const order =
		sort === 'lowest'
			? { price: 1 }
			: sort === 'highest'
			? { price: -1 }
			: sort === 'toprated'
			? { rating: -1 }
			: sort === 'newest'
			? { createdAt: -1 }
			: { _id: 1 }

	const categories = await Product.find().distinct('category')
	const brands = await Product.find().distinct('brand')
	const productDocs = await Product.find(
		{
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...brandFilter,
			...ratingFilter,
		},
		'-reviews'
	)
		.sort(order)
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.lean()

	const countProducts = await Product.countDocuments({
		...queryFilter,
		...categoryFilter,
		...priceFilter,
		...brandFilter,
		...ratingFilter,
	})
	await db.disconnect()

	const products = productDocs.map(db.convertDocToObj)

	return {
		props: {
			products,
			countProducts,
			page,
			pages: Math.ceil(countProducts / pageSize),
			categories,
			brands,
		},
	}
}
