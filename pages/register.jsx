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
import { useContext, useEffect, useState } from 'react'
import { Layout } from '../components'
import { Store } from '../config'
import { useStyles } from '../utils'
import Cookies from 'js-cookie'

export default function Register() {
  // user name
  const [name, setName] = useState('')
  // user email
  const [email, setEmail] = useState('')
  // user password
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

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
  }, [])

  // register user
  const handleSubmit = async e => {
    e.preventDefault()

    // check password
    if (password !== confirmPassword) {
      alert("passwords don't match")
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
      alert(err.response.data ? err.response.data.message : err.message)
    }
  }

  return (
    <Layout title='Register'>
      <div className={classes.section}>
        {/* login form */}
        <form onSubmit={handleSubmit} className={classes.form}>
          <Typography component='h1' variant='h4'>
            Register
          </Typography>

          <List>
            {/* user name field */}
            <ListItem>
              <TextField
                variant='outlined'
                fullWidth
                id='name'
                label='Name'
                inputProps={{ type: 'text' }}
                onChange={e => setName(e.target.value)}></TextField>
            </ListItem>

            {/* user email field */}
            <ListItem>
              <TextField
                variant='outlined'
                fullWidth
                id='email'
                label='Email'
                inputProps={{ type: 'email' }}
                onChange={e => setEmail(e.target.value)}></TextField>
            </ListItem>

            {/* user password field */}
            <ListItem>
              <TextField
                variant='outlined'
                fullWidth
                id='password'
                label='Password'
                inputProps={{ type: 'password' }}
                onChange={e => setPassword(e.target.value)}></TextField>
            </ListItem>

            {/* confirm password field */}
            <ListItem>
              <TextField
                variant='outlined'
                fullWidth
                id='confirmPassword'
                label='Confirm Password'
                inputProps={{ type: 'password' }}
                onChange={e => setConfirmPassword(e.target.value)}></TextField>
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
