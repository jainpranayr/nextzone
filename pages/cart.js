import { useContext } from 'react'
import { Layout } from '../components'
import { Store } from '../config'
import { useStyles } from '../utils'
import NextLink from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Select,
  MenuItem,
  Button,
  Card,
  List,
  ListItem,
} from '@material-ui/core'

function CartScreen() {
  // get styles
  const classes = useStyles()
  // get cartItems state
  const {
    state: {
      cart: { cartItems },
    },
  } = useContext(Store)

  return (
    <Layout title='Shopping Cart'>
      {/* check whether cartItem is empty or not */}
      {cartItems.length === 0 ? (
        <div className={classes.section}>
          Cart is empty. <NextLink href='/'>Go shopping</NextLink>
        </div>
      ) : (
        // main grid
        <Grid container spacing={2} className={classes.section}>
          {/* table grid */}
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* table column headings */}
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align='right'>Quantity</TableCell>
                    <TableCell align='right'>Price</TableCell>
                    <TableCell align='right'>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* individual cartItems */}
                  {cartItems.map(item => (
                    <TableRow key={item._id}>
                      {/* product image */}
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}></Image>
                          </Link>
                        </NextLink>
                      </TableCell>

                      {/* product name */}
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <Link>
                            <Typography>{item.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>

                      {/* product quantity */}
                      <TableCell align='right'>
                        <Select value={item.quantity}>
                          {[...Array(item.countInStock).keys()].map(x => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      {/* product price */}
                      <TableCell align='right'>${item.price}</TableCell>

                      {/* remove from cart button */}
                      <TableCell align='right'>
                        <Button variant='contained' color='secondary'>
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* total grid */}
          <Grid item md={3} xs={12} className={classes.card}>
            <Card>
              <List>
                <ListItem>
                  {/* subtotal heading */}
                  <Typography variant='h6'>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>

                {/* check out button */}
                <ListItem>
                  <Button variant='contained' color='primary' fullWidth>
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

// do not render in ssr
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })
