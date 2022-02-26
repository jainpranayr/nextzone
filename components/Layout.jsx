import Head from 'next/head'
import NextLink from 'next/link'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
  Link,
  createTheme,
  ThemeProvider,
  Switch,
} from '@material-ui/core'
import useStyles from '../utils/styles'
import { useContext } from 'react'
import { Store } from '../utils/store'
import Cookies from 'js-cookie'

export default function Layout({ title, description, children }) {
  // get styles
  const classes = useStyles()
  // get state and dispatch from store
  const { state, dispatch } = useContext(Store)
  // get darkMode state from state
  const { darkMode } = state

  // handle DarkMode on toggle
  const handleDarkMode = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
    const newDarkMode = !darkMode
    // store darkMode state in cookies
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
  }

  // dark and light theme
  const theme = createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  })

  return (
    <div>
      {/* Dynamic title of page */}
      <Head>
        <title>{title ? `${title} - Next Shop` : 'Next Shop'}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>

      {/* Theme Context */}
      <ThemeProvider theme={theme}>
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
            {/* dark/light mode toggle */}
            <Switch checked={darkMode} onChange={handleDarkMode}></Switch>
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
      </ThemeProvider>
    </div>
  )
}
