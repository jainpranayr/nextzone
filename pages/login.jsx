import {
  List,
  ListItem,
  Typography,
  TextField,
  Button,
  Link,
} from '@material-ui/core'
import NextLink from 'next/link'
import React from 'react'
import { Layout } from '../components'
import { useStyles } from '../utils'
import { useEffect, useContext } from 'react'
import axios from 'axios'
import { getError, Store } from '../config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  // get userInfo and dispatch function froim Store
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store)

  // get styles
  const classes = useStyles()

  // setup router
  const router = useRouter()
  // get redirect from url
  const { redirect } = router.query

  // handle login
  const logUserin = async ({ email, password }) => {
    closeSnackbar()
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
    } catch (err) {
      // show error
      enqueueSnackbar(getError(err), { variant: 'error' })
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
      <div className={classes.section}>
        {/* login form */}
        <form className={classes.form} onSubmit={handleSubmit(logUserin)}>
          <Typography component='h1' variant='h4'>
            Login
          </Typography>

          <List>
            {/* email field */}
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

            {/* password field */}
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

            {/* login button */}
            <ListItem>
              <Button
                variant='contained'
                type='submit'
                fullWidth
                color='primary'>
                Login
              </Button>
            </ListItem>

            {/* register link */}
            <ListItem>
              Don&apos;t have an account? &nbsp;
              <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
                <Link>Register</Link>
              </NextLink>
            </ListItem>
          </List>
        </form>
      </div>
    </Layout>
  )
}
