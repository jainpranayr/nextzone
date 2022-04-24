import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  // common
  grow: {
    flexGrow: 1,
  },
  section: {
    marginTop: 25,
    marginBottom: 10,
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 800,
  },
  error: {
    color: '#f04040',
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

  // total card
  card: {
    marginTop: 20,
  },

  // form
  form: {
    maxWidth: 600,
    minWidth: '100%',
    margin: '0 auto',
    textAlign: 'center',
  },

  username: {
    color: '#ffffff',
    textTransform: 'initial',
  },

  reviewForm: {
    maxWidth: 800,
    width: '100%',
  },
  reviewItem: {
    marginRight: '1rem',
    borderRight: '1px #808080 solid',
    paddingRight: '1rem',
  },
  toolbar: {
    justifyContent: 'space-between',
  },

  // footer
  footer: {
    textAlign: 'center',
  },
})

export default useStyles
