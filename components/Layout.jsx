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
  Badge,
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core'
import { useStyles } from '../utils'
import { useContext, useState } from 'react'
import { Store } from '../config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

export default function Layout({ title, description, children }) {
  // login Menu state
  const [loginMenuToggle, setLoginMenuToggle] = useState(null)
  // get state and dispatch from store
  const {
    state: {
      darkMode,
      cart: { cartItems },
      userInfo,
    },
    dispatch,
  } = useContext(Store)
  // setup router
  const router = useRouter()
  // get styles
  const classes = useStyles()

  // handle DarkMode on toggle
  const handleDarkMode = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })
    const newDarkMode = !darkMode
    // store darkMode state in cookies
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF')
  }

  //open login menu
  const openLoginmenu = e => {
    setLoginMenuToggle(e.currentTarget)
  }
  // close login menu
  const closeLoginMenu = e => {
    setLoginMenuToggle(null)
  }
  // handle Logout
  const handleLogOut = () => {
    // close menu
    setLoginMenuToggle(null)
    // dispatch logout event
    dispatch({ type: 'USER_LOGOUT' })
    // empty cookies
    Cookies.remove('userInfo')
    Cookies.remove('cartItems')
    // redirect to login page
    router.push('/login')
  }

  // dark and light theme styles
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

            {/* cart and login links */}
            <div>
              {/* cart link */}
              <NextLink href='/cart' passHref>
                <Link>
                  {/* Add to cart badge */}
                  {cartItems.length > 0 ? (
                    <Badge color='secondary' badgeContent={cartItems.length}>
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>

              {/* if user is logged in show username or show Login */}
              {userInfo ? (
                <>
                  {/* username */}
                  <Button
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    onClick={openLoginmenu}
                    className={classes.username}>
                    {userInfo.name}
                  </Button>

                  {/* login menu */}
                  <Menu
                    id='simple-menu'
                    anchorEl={loginMenuToggle}
                    keepMounted
                    open={Boolean(loginMenuToggle)}
                    onClose={closeLoginMenu}>
                    <MenuItem onClick={closeLoginMenu}>Profile</MenuItem>
                    <MenuItem onClick={closeLoginMenu}>My account</MenuItem>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                // login link
                <NextLink href='/login' passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
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
