import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
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

  menuButton: { padding: 0 },

  // search
  searchSection: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  searchForm: {
    border: '1px solid #ffffff',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  searchInput: {
    paddingLeft: 5,
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
  },
  iconButton: {
    backgroundColor: '#f8c040',
    padding: 5,
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
  },

  sort: {
    marginRight: 5,
  },
}))

export default useStyles
