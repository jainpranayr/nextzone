import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'
import axios from 'axios'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Layout } from '../components'
import { getError, Store } from '../config'

export default function Login() {
	const {
		handleSubmit,
		register,
		formState: { errors },
		setValue,
	} = useForm()
	const [showPassword, setShowPassword] = useState(false)

	// get userInfo and dispatch function froim Store
	const {
		state: { userInfo },
		dispatch,
	} = useContext(Store)

	// setup router
	const router = useRouter()
	// get redirect from url
	const { redirect } = router.query

	// handle login
	const logUserin = async ({ email, password }) => {
		try {
			// check if user credentials is correct
			const { data } = await axios.post('/api/users/login', {
				email,
				password,
			})

			// dispatch user login event
			dispatch({ type: 'USER_LOGIN', payload: data })
			// store userInfo in cookies
			Cookies.set('userInfo', data)

			// redirect
			router.push(redirect || '/')
			toast.success("You're logged in", { duration: 3000 })
		} catch (err) {
			// show error
			toast.error(getError(err), { duration: 3000 })
		}
	}

	// if user is already logged in redirect to home page
	useEffect(() => {
		if (userInfo) {
			router.push('/')
		}
	}, [router, userInfo])

	return (
		<Layout title='Login'>
			<div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Sign in to your account
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Or{' '}
						<NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
							<span className='font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer'>
								Create a new one.
							</span>
						</NextLink>
					</p>
				</div>
				<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
					<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
						<form className='space-y-6' onSubmit={handleSubmit(logUserin)}>
							{/* Email Field */}
							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-700'>
									Email address
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='email'
										name='email'
										type='email'
										autoComplete='email'
										className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										{...register('email', {
											required: true,
											pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
										})}
									/>
								</div>
								{errors.email && (
									<p className='mt-2 text-sm text-red-600' id='email-error'>
										Your email is not valid.
									</p>
								)}
							</div>

							{/* Password Field */}
							<div>
								<label
									htmlFor='password'
									className='block text-sm font-medium text-gray-700'>
									Password
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='password'
										name='password'
										type={showPassword ? 'text' : 'password'}
										autoComplete='current-password'
										className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										{...register('password', {
											required: true,
											minLength: 6,
										})}
									/>
									<div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
										{showPassword ? (
											<EyeOffIcon
												className='h-5 w-5 text-indigo-500 cursor-pointer'
												onClick={() => setShowPassword(false)}
											/>
										) : (
											<EyeIcon
												className='h-5 w-5 text-indigo-500 cursor-pointer'
												onClick={() => setShowPassword(true)}
											/>
										)}
									</div>
								</div>
								{errors.password && (
									<p className='mt-2 text-sm text-red-600' id='email-error'>
										Your password must be atleast 6 characters long.
									</p>
								)}
							</div>

							{/* Submit Button */}
							<div>
								<input
									type='submit'
									value='Sign in'
									className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'
								/>
							</div>

							<button
								onClick={() => {
									setValue('email', 'guest@mail.co')
									setValue('password', 'Pass@1234')
								}}
								className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'>
								Sign in as Guest
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}
