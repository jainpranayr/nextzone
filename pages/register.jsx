import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Link,
} from '@material-ui/core'
import axios from 'axios'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { useContext, useEffect } from 'react'
import { Layout } from '../components'
import { getError, Store } from '../config'
import { useStyles } from '../utils'
import Cookies from 'js-cookie'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

export default function Register() {
  // get required props from react-hook-form
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // get styles
  const classes = useStyles()

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
  const registerUser = async ({ name, email, password, confirmPassword }) => {
    closeSnackbar()

    // check password
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords don't match", { variant: 'error' })
      return
    }

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
      Cookies.set('userInfo', data)

      // redirect
      router.push(redirect || '/')
    } catch (err) {
      // show error
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  return (
    <Layout title='Register'>
      <div className={classes.section}>
        {/* login form */}
        <form onSubmit={handleSubmit(registerUser)} className={classes.form}>
          <Typography component='h1' variant='h4'>
            Register
          </Typography>

          <List>
            {/* user name field */}
            <ListItem>
              {/* handle validation */}
              <Controller
                name='name'
                control={control}
                defaultValue=''
                // validation rules
                rules={{
                  required: true,
                  minLength: 2,
                }}
                // render field
                render={({ field }) => (
                  // actual field
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='name'
                    label='Name'
                    inputProps={{ type: 'name' }}
                    // check error
                    error={Boolean(errors.name)}
                    // errors and warnings
                    helperText={
                      errors.name
                        ? errors.name.type === 'minLength'
                          ? 'Name length is less than 1'
                          : 'Name is required'
                        : ''
                    }
                    {...field}></TextField>
                )}></Controller>
            </ListItem>

            {/* user email field */}
            <ListItem>
              <Controller
                name='email'
                control={control}
                defaultValue=''
                rules={{
                  required: true,
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                }}
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='email'
                    label='Email'
                    inputProps={{ type: 'email' }}
                    error={Boolean(errors.email)}
                    helperText={
                      errors.email
                        ? errors.email.type === 'pattern'
                          ? 'Email is not valid'
                          : 'Email is required'
                        : ''
                    }
                    {...field}></TextField>
                )}></Controller>
            </ListItem>

            {/* user password field */}
            <ListItem>
              <Controller
                name='password'
                control={control}
                defaultValue=''
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='password'
                    label='Password'
                    inputProps={{ type: 'password' }}
                    error={Boolean(errors.password)}
                    helperText={
                      errors.password
                        ? errors.password.type === 'minLength'
                          ? 'Password length is less than 5'
                          : 'Password is required'
                        : ''
                    }
                    {...field}></TextField>
                )}></Controller>
            </ListItem>

            {/* confirm password field */}
            <ListItem>
              <Controller
                name='confirmPassword'
                control={control}
                defaultValue=''
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field }) => (
                  <TextField
                    variant='outlined'
                    fullWidth
                    id='confirmPassword'
                    label='Confirm Password'
                    inputProps={{ type: 'password' }}
                    error={Boolean(errors.confirmPassword)}
                    helperText={
                      errors.confirmPassword
                        ? errors.confirmPassword.type === 'minLength'
                          ? 'Confirm Password length is less than 5'
                          : 'Confirm  Password is required'
                        : ''
                    }
                    {...field}></TextField>
                )}></Controller>
            </ListItem>

            {/* Register button */}
            <ListItem>
              <Button
                variant='contained'
                type='submit'
                fullWidth
                color='primary'>
                Register
              </Button>
            </ListItem>

            {/* login page link */}
            <ListItem>
              Already have an account? &nbsp;
              <NextLink href={`/login?redirect=${redirect || '/'}`} passHref>
                <Link>Login</Link>
              </NextLink>
            </ListItem>
          </List>
        </form>
      </div>
    </Layout>
  )
}
