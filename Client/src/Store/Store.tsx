

  import { configureStore } from '@reduxjs/toolkit'
import basketReducer from './Slices/cartSlice'
import checkoutReducer from './Slices/checkOutSlice'

import userAuthReducer from './Slices/userAuth'
import { productService } from '../services/productService'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { cartService } from '../services/cartService'
import { userService } from '../services/userService'
import { addressService } from '../services/addressService'
import { orderService } from '../services/checkoutService'
import { cardService } from '../services/cardService'


export const store = configureStore({
  
  reducer: {
    basket: basketReducer,
    user: userAuthReducer, 
    checkout: checkoutReducer,
    // product: productReducer,
    [userService.reducerPath]:userService.reducer,
    [productService.reducerPath]: productService.reducer,
    [cartService.reducerPath]:cartService.reducer,
    [addressService.reducerPath]:addressService.reducer,
    [orderService.reducerPath]: orderService.reducer,
    [cardService.reducerPath]: cardService.reducer,

  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productService.middleware  , cartService.middleware , userService.middleware , addressService.middleware , orderService.middleware ,cardService.middleware),

})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


setupListeners(store.dispatch)