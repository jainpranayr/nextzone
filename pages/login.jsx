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
import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  // user email
  const [email, setEmail] = useState('')
  // user password
  const [password, setPassword] = useState('')
  // get styles
  const classes = useStyles()

  // handle login
  const handleLogin = async e => {
    e.preventDefault()
    try {
      // check if user credentials is correct
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      })
      alert('login succesful')
    } catch (err) {
      // show error
      alert(err.response.data ? err.response.data.message : err.message)
    }
  }

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
