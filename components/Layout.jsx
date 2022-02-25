import Head from 'next/head'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  CssBaseline,
} from '@material-ui/core'
import useStyles from '../utils/styles'

export default function Layout({ children }) {
  const classes = useStyles()

  return (
    <div>
      {/* CSS Reset */}
      <CssBaseline />
      {/* Address bar of page */}
      <Head>
        <title>Next Shop</title>
      </Head>

      {/* Navbar */}
      <AppBar position='static' className={classes.navbar}>
        <Toolbar>
          <Typography className={classes.heading}>nextshop</Typography>
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
