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
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Store } from '../config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function Login() {
  // user email
  const [email, setEmail] = useState('')
  // user password
  const [password, setPassword] = useState('')
  // get styles
  const classes = useStyles()
  // setup router
  const router = useRouter()
  // get redirect from url
  const { redirect } = router.query
  // get userInfo and dispatch function froim Store
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store)

  // handle login
  const handleLogin = async e => {
    e.preventDefault()
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
      // alert(err.response.data ? err.response.data.message : err.message)
      console.log(err)
    }
  }

  // if user is already logged in redirect to home page
  useEffect(() => {
    if (userInfo) {
      router.push('/')
    }
  }, [])

  return (
    <Layout title='Login'>
      <div className={classes.section}>
        {/* login form */}
        <form className={classes.form} onSubmit={handleLogin}>
          <Typography component='h1' variant='h4'>
            Login
          </Typography>

          {/* email field */}
          <List>
            <ListItem>
              <TextField
                variant='outlined'
                fullWidth
                id='email'
                label='Email'
                inputProps={{ type: 'email' }}
                onChange={e => setEmail(e.target.value)}></TextField>
            </ListItem>

            {/* password field */}
            <ListItem>
              <TextField
                variant='outlined'
                fullWidth
                id='password'
                label='Password'
                inputProps={{ type: 'password' }}
                onChange={e => setPassword(e.target.value)}></TextField>
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
              Don't have an account? &nbsp;
              <NextLink href='/register' passHref>
                <Link>Register</Link>
              </NextLink>
            </ListItem>
          </List>
        </form>
      </div>
    </Layout>
  )
}
