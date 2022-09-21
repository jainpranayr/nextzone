import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { Layout } from '../components'
import { getError, Store } from '../config'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'

export default function Register() {
	// get required props from react-hook-form
	const {
		handleSubmit,
		register,
		watch,
		formState: { errors },
	} = useForm()
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [remember, setRemember] = useState(false)

	// get userInfo from Store
	const {
		state: { userInfo },
		dispatch,
	} = useContext(Store)

	// setup router
	const router = useRouter()
	// get redirect from url
	const { redirect } = router.query

	// if user is logged in redirect to homme page
	useEffect(() => {
		if (userInfo) {
			router.push('/')
		}
	}, [router, userInfo])

	// register user
	const registerUser = async ({ name, email, password }) => {
		closeSnackbar()

		try {
			// post user data
			const { data } = await axios.post('/api/users/register', {
				name,
				email,
				password,
			})

			// dispatch user login event
			dispatch({ type: 'USER_LOGIN', payload: data })

			// setup userInfo Cookie
			remember && Cookies.set('userInfo', data)

			// redirect
			router.push(redirect || '/')
		} catch (err) {
			// show error
			enqueueSnackbar(getError(err), { variant: 'error' })
		}
	}

	return (
		<Layout title='Register'>
			<div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Create Account
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Already a member?{' '}
						<NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
							<span className='font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer'>
								Sign In
							</span>
						</NextLink>
					</p>
				</div>
				<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
					<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
						<form className='space-y-6' onSubmit={handleSubmit(registerUser)}>
							{/* Name Field */}
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700'>
									Username
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='name'
										name='name'
										type='name'
										autoComplete='name'
										className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										{...register('name', {
											required: true,
											minLength: 3,
										})}
									/>
								</div>
								{errors.name && (
									<p className='mt-2 text-sm text-red-600' id='email-error'>
										Your username must be atleast 3 characters long.
									</p>
								)}
							</div>

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

							{/* Confirm Password Fiels */}
							<div>
								<label
									htmlFor='password'
									className='block text-sm font-medium text-gray-700'>
									Confirm Password
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='confirm_password'
										name='confirm_password'
										type={showConfirmPassword ? 'text' : 'password'}
										autoComplete='current-password'
										className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										{...register('confirm_password', {
											required: true,
											minLength: 6,
											validate: value => value === watch('password'),
										})}
									/>
									<div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
										{showConfirmPassword ? (
											<EyeOffIcon
												className='h-5 w-5 text-indigo-500 cursor-pointer'
												onClick={() => setShowConfirmPassword(false)}
											/>
										) : (
											<EyeIcon
												className='h-5 w-5 text-indigo-500 cursor-pointer'
												onClick={() => setShowConfirmPassword(true)}
											/>
										)}
									</div>
								</div>
								{errors.confirm_password && (
									<p className='mt-2 text-sm text-red-600' id='email-error'>
										Passwords don&apos;t match.
									</p>
								)}
							</div>

							<div className='flex items-center justify-between'>
								<div className='flex items-center'>
									<input
										id='remember-me'
										name='remember-me'
										type='checkbox'
										className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
										checked={remember}
										onChange={e => {
											setRemember(e.target.checked)
										}}
									/>
									<label
										htmlFor='remember-me'
										className='ml-2 block text-sm text-gray-900'>
										Remember me
									</label>
								</div>
							</div>

							{/* Submit Button */}
							<div>
								<input
									type='submit'
									value='Register'
									className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	)
}
