/* eslint-disable react/jsx-key */
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
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemText,
  InputBase,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import CancelIcon from '@material-ui/icons/Cancel'
import SearchIcon from '@material-ui/icons/Search'
import { useStyles } from '../utils'
import { useContext, useState, useEffect } from 'react'
import { Store, getError } from '../config'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import axios from 'axios'

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
  const closeLoginMenu = redirect => {
    setLoginMenuToggle(null)
    if (redirect) router.push(redirect)
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

  const [sidbarVisible, setSidebarVisible] = useState(false)

  const handleOpenSidebar = () => {
    setSidebarVisible(true)
  }
  const handleCloseSidebar = () => {
    setSidebarVisible(false)
  }

  const [categories, setCategories] = useState([])
  const { enqueueSnackbar } = useSnackbar()

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories`)
      setCategories(data)
    } catch (err) {
      enqueueSnackbar(getError(err), { variant: 'error' })
    }
  }

  const [query, setQuery] = useState('')

  const handleQueryChange = e => {
    setQuery(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    router.push(`/search?query=${query}`)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div>
      {/* Dynamic title of page */}
      <Head>
        <title>{title ? `${title} - nextshop` : 'nextshop'}</title>
        {description && <meta name='description' content={description}></meta>}
      </Head>

      {/* Theme Context */}
      <ThemeProvider theme={theme}>
        {/* CSS Reset */}
        <CssBaseline />
        {/* Navbar */}
        <AppBar position='static' className={classes.navbar}>
          <Toolbar className={classes.toolbar}>
            <Box display='flex' alignItems='center'>
              <IconButton
                edge='start'
                aria-label='open drawer'
                onClick={handleOpenSidebar}
                className={classes.menuButton}>
                <MenuIcon className={classes.navbarButton} />
              </IconButton>
              <NextLink href='/' passHref>
                <Link underline='none'>
                  <Typography className={classes.logo}>nextzone</Typography>
                </Link>
              </NextLink>
            </Box>
            <Drawer
              anchor='left'
              open={sidbarVisible}
              onClose={handleCloseSidebar}>
              <List>
                <ListItem>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'>
                    <Typography>Shopping by category</Typography>
                    <IconButton aria-label='close' onClick={handleCloseSidebar}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                <Divider light />
                {categories.map(category => (
                  <NextLink
                    key={category}
                    href={`/search?category=${category}`}
                    passHref>
                    <ListItem button component='a' onClick={handleCloseSidebar}>
                      <ListItemText primary={category}></ListItemText>
                    </ListItem>
                  </NextLink>
                ))}
              </List>
            </Drawer>

            <div className={classes.searchSection}>
              <form onSubmit={handleSubmit} className={classes.searchForm}>
                <InputBase
                  name='query'
                  className={classes.searchInput}
                  placeholder='Search products'
                  onChange={handleQueryChange}
                />
                <IconButton
                  type='submit'
                  className={classes.iconButton}
                  aria-label='search'>
                  <SearchIcon />
                </IconButton>
              </form>
            </div>

            {/* dark/light mode toggle */}
            <Switch checked={darkMode} onChange={handleDarkMode}></Switch>

            {/* cart and login links */}
            <div>
              {/* cart link */}
              <NextLink href='/cart' passHref>
                <Link>
                  {/* Add to cart badge */}
                  <Typography component='span'>
                    {cartItems.length > 0 ? (
                      <Badge color='secondary' badgeContent={cartItems.length}>
                        Cart
                      </Badge>
                    ) : (
                      'Cart'
                    )}
                  </Typography>
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
                    <MenuItem onClick={() => closeLoginMenu('/profile')}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => closeLoginMenu('/order-history')}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                // login link
                <NextLink href='/login' passHref>
                  <Link>
                    <Typography component='span'>Login</Typography>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container className={classes.main}>{children}</Container>

        {/* Footer */}
        <footer className={classes.footer}>
          <Typography>All rights reserved. nextshop.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  )
}
