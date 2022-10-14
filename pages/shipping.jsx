import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { CheckoutWizard, Layout } from '../components'
import { Store } from '../config'

export default function Shipping() {
	// setup router
	const router = useRouter()

	// get userInfo and dispatch from Store
	const {
		state: {
			userInfo,
			cart: { shippingAddress },
		},
		dispatch,
	} = useContext(Store)

	// get required values from react hook form
	const {
		handleSubmit,
		formState: { errors },
		setValue,
		register,
	} = useForm()

	useEffect(() => {
		// if user not logged in redirect to login with redirect set to shippping
		if (!userInfo) {
			router.push('/login?redirect=/shipping')
		}

		// set values from saved address
		setValue('fullName', shippingAddress.fullName)
		setValue('address', shippingAddress.address)
		setValue('city', shippingAddress.city)
		setValue('postalCode', shippingAddress.postalCode)
		setValue('state', shippingAddress.state)
	}, [userInfo, router, setValue, shippingAddress])

	// form submit handler
	const submitHandler = ({ fullName, address, city, postalCode, state }) => {
		// dispatch save shipping address function
		dispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: { fullName, address, city, postalCode, state },
		})

		// store address in cookies
		Cookies.set('shippingAddress', {
			fullName,
			address,
			city,
			postalCode,
			state,
		})

		// redirect user to placeorder page
		router.push('/placeorder')
	}

	return (
		<Layout title='Shipping Address'>
			<CheckoutWizard activeStep={1} />
			<form
				className='space-y-8 max-w-2xl mx-auto mt-6'
				onSubmit={handleSubmit(submitHandler)}>
				<div>
					<h2 className='leading-6 font-medium text-2xl text-gray-900'>
						Shipping Address
					</h2>
				</div>
				<div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
					<div className='sm:col-span-4'>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-700'>
							Full name
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='fullName'
								id='name'
								autoComplete='given-name'
								className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
								{...register('fullName', {
									required: true,
									minLength: 3,
								})}
							/>
						</div>
						{errors.fullName && (
							<p className='mt-2 text-sm text-red-600' id='email-error'>
								Your username must be atleast 3 characters long.
							</p>
						)}
					</div>

					<div className='sm:col-span-6'>
						<label
							htmlFor='street-address'
							className='block text-sm font-medium text-gray-700'>
							Street address
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='street-address'
								id='street-address'
								autoComplete='street-address'
								className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
								{...register('address', {
									required: true,
								})}
							/>
						</div>
						{errors.address && (
							<p className='mt-2 text-sm text-red-600' id='email-error'>
								Street Address is required
							</p>
						)}
					</div>

					<div className='sm:col-span-2'>
						<label
							htmlFor='city'
							className='block text-sm font-medium text-gray-700'>
							City
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='city'
								id='city'
								autoComplete='address-level2'
								className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
								{...register('city', {
									required: true,
								})}
							/>
						</div>
						{errors.city && (
							<p className='mt-2 text-sm text-red-600' id='email-error'>
								City is required
							</p>
						)}
					</div>

					<div className='sm:col-span-2'>
						<label
							htmlFor='region'
							className='block text-sm font-medium text-gray-700'>
							State / Province
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='region'
								id='region'
								autoComplete='address-level1'
								className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
								{...register('state', {
									required: true,
								})}
							/>
						</div>
						{errors.state && (
							<p className='mt-2 text-sm text-red-600' id='email-error'>
								State is required
							</p>
						)}
					</div>

					<div className='sm:col-span-2'>
						<label
							htmlFor='postal-code'
							className='block text-sm font-medium text-gray-700'>
							ZIP / Postal code
						</label>
						<div className='mt-1'>
							<input
								type='text'
								name='postal-code'
								id='postal-code'
								autoComplete='postal-code'
								className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'
								{...register('postalCode', {
									required: true,
									pattern: /^([0-9]{6})$/,
								})}
							/>
						</div>
						{errors.postalCode && (
							<p className='mt-2 text-sm text-red-600' id='email-error'>
								Your postalCode is not valid.
							</p>
						)}
					</div>
				</div>

				<div className='pt-5'>
					<div className='flex justify-end'>
						<button
							type='submit'
							className='ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
							Save
						</button>
					</div>
				</div>
			</form>
		</Layout>
	)
}
