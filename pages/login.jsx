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

export default function Login() {
  // get styles
  const classes = useStyles()
  return (
    <Layout title='Login'>
      <div className={classes.section}>
        {/* login form */}
        <form className={classes.form}>
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
                inputProps={{ type: 'email' }}></TextField>
            </ListItem>

            {/* password field */}
            <ListItem>
              <TextField
                variant='outlined'
                fullWidth
                id='password'
                label='Password'
                inputProps={{ type: 'password' }}></TextField>
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
