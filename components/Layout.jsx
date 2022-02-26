import Head from 'next/head'
import NextLink from 'next/link'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Link,
} from '@material-ui/core'
import useStyles from '../utils/styles'

export default function Layout({ title, description, children }) {
  const classes = useStyles()

  return (
    <div>
      {/* Dynamic title of page */}
      <Head>
        <title>{title ? `${title} - Next Shop` : 'Next Shop'}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>

      {/* CSS Reset */}
      <CssBaseline />
      {/* Navbar */}
      <AppBar position='static' className={classes.navbar}>
        <Toolbar>
          <NextLink href='/' passHref>
            <Link underline='none'>
              <Typography className={classes.logo}>nextshop</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow}></div>
          <div>
            <NextLink href='/cart' passHref>
              <Link underline='none'>Cart</Link>
            </NextLink>
            <NextLink href='/login' passHref>
              <Link underline='none'>Login</Link>
            </NextLink>
          </div>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container className={classes.main}>{children}</Container>

      {/* Footer */}
      <footer className={classes.footer}>
        <Typography>All rights reserved. Next Shop.</Typography>
      </footer>
    </div>
  )
}
