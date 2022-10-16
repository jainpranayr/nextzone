import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'
import { Card, Grid, List, ListItem, ListItemText } from '@material-ui/core'
import axios from 'axios'
import Cookies from 'js-cookie'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MyHead } from '../components'
import { getError, Store } from '/config'
import { useStyles } from '/utils'

function Profile() {
	const { state, dispatch } = useContext(Store)
	const {
		handleSubmit,
		formState: { errors },
		register,
		setValue,
		watch,
	} = useForm()
	const router = useRouter()
	const classes = useStyles()
	const { userInfo } = state
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const submitHandler = async ({ name, email, password }) => {
		try {
			const { data } = await axios.put(
				'/api/users/profile',
				{
					name,
					email,
					password,
				},
				{ headers: { authorization: `Bearer ${userInfo.token}` } }
			)
			dispatch({ type: 'USER_LOGIN', payload: data })
			Cookies.set('userInfo', JSON.stringify(data))

			toast.success('Profile updated successfully', { duration: 3000 })
		} catch (err) {
			toast.error(getError(err), { duration: 3000 })
		}
	}

	useEffect(() => {
		if (!userInfo) {
			return router.push('/login')
		}
		setValue('name', userInfo.name)
		setValue('email', userInfo.email)
	}, [router, setValue, userInfo])

	return (
		<>
			<MyHead
				title='User Profile'
				url={`https://nextzone.vercel.app/${router.asPath}`}
			/>
			<Grid container spacing={1}>
				<Grid item md={3} xs={12}>
					<Card className={classes.section}>
						<List>
							<NextLink href='/profile' passHref>
								<ListItem selected button component='a'>
									<ListItemText primary='User Profile'></ListItemText>
								</ListItem>
							</NextLink>
							<NextLink href='/order-history' passHref>
								<ListItem button component='a'>
									<ListItemText primary='Order History'></ListItemText>
								</ListItem>
							</NextLink>
						</List>
					</Card>
				</Grid>
				<Grid item md={9} xs={12}>
					{userInfo?.isGuest ? (
						<h2 className='mt-6 text-center text-xl font-medium text-gray-900'>
							The Guest Profile cannot be updated.
						</h2>
					) : (
						<>
							<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
								Update Profile
							</h2>
							<div className='mt-4 sm:mx-auto sm:w-full sm:max-w-md'>
								<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
									<form
										className='space-y-6'
										onSubmit={handleSubmit(submitHandler)}>
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
												<p
													className='mt-2 text-sm text-red-600'
													id='email-error'>
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
												<p
													className='mt-2 text-sm text-red-600'
													id='email-error'>
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
												<p
													className='mt-2 text-sm text-red-600'
													id='email-error'>
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
												<p
													className='mt-2 text-sm text-red-600'
													id='email-error'>
													Passwords don&apos;t match.
												</p>
											)}
										</div>

										{/* Submit Button */}
										<div>
											<input
												type='submit'
												value='Update'
												className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'
											/>
										</div>
									</form>
								</div>
							</div>
						</>
					)}
				</Grid>
			</Grid>
		</>
	)
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false })
