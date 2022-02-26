import Cookies from 'js-cookie'
import { createContext, useReducer } from 'react'

export const Store = createContext()

// set or get dark mode initial state
const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
}

// setup reducer for dark mode
const reducer = (state, action) => {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true }
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false }
    default:
      return state
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
}
