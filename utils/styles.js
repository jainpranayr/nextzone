import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  // common
  grow: {
    flexGrow: 1,
  },

  // navbar
  logo: {
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  navbar: {
    backgroundColor: '#203040',
    '& a': {
      color: '#fff',
      marginLeft: 10,
    },
  },

  // main content
  main: {
    minHeight: '80vh',
  },

  // footer
  footer: {
    textAlign: 'center',
  },
})

export default useStyles
