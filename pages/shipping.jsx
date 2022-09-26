import {
	Button,
	List,
	ListItem,
	TextField,
	Typography,
} from '@material-ui/core'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { CheckoutWizard, Layout } from '../components'
import { Store } from '../config'
import { useStyles } from '../utils'

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
		control,
		formState: { errors },
		setValue,
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
		setValue('country', shippingAddress.country)
	}, [userInfo, router, setValue, shippingAddress])

	// get styles
	const classes = useStyles()

	// form submit handler
	const submitHandler = ({ fullName, address, city, postalCode, country }) => {
		// dispatch save shipping address function
		dispatch({
			type: 'SAVE_SHIPPING_ADDRESS',
			payload: { fullName, address, city, postalCode, country },
		})

		// store address in cookies
		Cookies.set('shippingAddress', {
			fullName,
			address,
			city,
			postalCode,
			country,
		})

		// redirect user to placeorder page
		router.push('/placeorder')
	}

	return (
		<Layout title='Shipping Address'>
			<CheckoutWizard activeStep={1} />
			<form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
				<Typography component='h1' variant='h4'>
					Shipping Address
				</Typography>
				<List>
					<ListItem>
						<Controller
							name='fullName'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='fullName'
									label='Full Name'
									error={Boolean(errors.fullName)}
									helperText={
										errors.fullName
											? errors.fullName.type === 'minLength'
												? 'Full Name length is more than 1'
												: 'Full Name is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='address'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='address'
									label='Address'
									error={Boolean(errors.address)}
									helperText={
										errors.address
											? errors.address.type === 'minLength'
												? 'Address length is more than 1'
												: 'Address is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='city'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='city'
									label='City'
									error={Boolean(errors.city)}
									helperText={
										errors.city
											? errors.city.type === 'minLength'
												? 'City length is more than 1'
												: 'City is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='postalCode'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='postalCode'
									label='Postal Code'
									error={Boolean(errors.postalCode)}
									helperText={
										errors.postalCode
											? errors.postalCode.type === 'minLength'
												? 'Postal Code length is more than 1'
												: 'Postal Code is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Controller
							name='country'
							control={control}
							defaultValue=''
							rules={{
								required: true,
								minLength: 2,
							}}
							render={({ field }) => (
								<TextField
									variant='outlined'
									fullWidth
									id='country'
									label='Country'
									error={Boolean(errors.country)}
									helperText={
										errors.country
											? errors.country.type === 'minLength'
												? 'Country length is more than 1'
												: 'Country is required'
											: ''
									}
									{...field}></TextField>
							)}></Controller>
					</ListItem>
					<ListItem>
						<Button variant='contained' type='submit' fullWidth color='primary'>
							Continue
						</Button>
					</ListItem>
				</List>
			</form>
		</Layout>
	)
}
