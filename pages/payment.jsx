import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Store } from '../config'
import { Layout, CheckoutWizard } from '../components'
import { useStyles } from '../utils'
import { useSnackbar } from 'notistack'
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core'

const payment = () => {
  // setup snacknbar
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  // get styles
  const classes = useStyles()
  // setup router
  const router = useRouter()
  // state for payment method
  const [paymentMethod, setPaymentMethod] = useState('')
  // get required states from context
  const {
    state: {
      cart: { shippingAddress },
    },
    dispatch,
  } = useContext(Store)

  useEffect(() => {
    // if address not present redirect to shipping
    if (!shippingAddress.address) {
      router.push('/shipping')
    } else {
      // get payment method from cookies
      setPaymentMethod(Cookies.get('paymentMethod') || '')
    }
  }, [])

  // form sybmit handler
  const submitHandler = e => {
    closeSnackbar()
    e.preventDefault()
    // show error when payment method not selected
    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' })
    } else {
      // run save payment method function from context
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod })
      // store payment method in cookies
      Cookies.set('paymentMethod', paymentMethod)
      // redirect to place order screen
      router.push('/placeorder')
    }
  }
  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component='h1' variant='h4'>
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='Payment Method'
                name='paymentMethod'
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}>
                <FormControlLabel
                  label='PayPal'
                  value='PayPal'
                  control={<Radio />}></FormControlLabel>
                <FormControlLabel
                  label='Stripe'
                  value='Stripe'
                  control={<Radio />}></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type='submit' variant='contained' color='primary'>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type='button'
              variant='contained'
              onClick={() => router.push('/shipping')}>
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  )
}

export default payment
