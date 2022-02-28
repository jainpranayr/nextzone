import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'

export const Store = createContext()

// setup initialstate
const initialState = {
  // set or get darkMode state from Cookies
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
  // set or get cartItems state from Cookies
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
  },
}

// setup reducer
const reducer = (state, action) => {
  switch (action.type) {
    // darkMode
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true }
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false }

    // add to cart
    case 'CART_ADD_ITEM': {
      // get product detail
      const newItem = action.payload
      // check if product is already in cart
      const itemExists = state.cart.cartItems.find(
        item => item._id === newItem._id
      )

      const cartItems = itemExists
        ? state.cart.cartItems.map(item =>
            item.name === itemExists.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem]

      // store cartItems in Cookies
      Cookies.set('cartItems', JSON.stringify(cartItems))

      return { ...state, cart: { ...state.cart, cartItems } }
    }
    // remove from cart
    case 'CART_REMOVE_ITEM': {
      // remove product from cart
      const cartItems = state.cart.cartItems.filter(
        item => item._id !== action.payload._id
      )

      // store updated cartItems in Cookies
      Cookies.set('cartItems', JSON.stringify(cartItems))
      return { ...state, cart: { ...state.cart, cartItems } }
    }

    default:
      return state
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
}
