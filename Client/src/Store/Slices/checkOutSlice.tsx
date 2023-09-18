import { createSlice } from "@reduxjs/toolkit";
import { item } from "../../typesInterface/interface";



interface type {
    checkout: item[]
}
const initialState: type = {
    checkout: []
}

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        addItems(state, action) {
            state.checkout = action.payload
        },
        removeItems(state) {
            state.checkout = []
        },
        updateCartItemQuantity(state, action) {
            const index = state.checkout.findIndex((item) => item.productID.productID === action.payload.itemId);
            if (index >= 0) {
                state.checkout[index] = {
                    ...state.checkout[index],
                    quantity: action.payload.quantity
                }
            }
        },
    }
})


export const { addItems, removeItems, updateCartItemQuantity } = checkoutSlice.actions;

export default checkoutSlice.reducer;