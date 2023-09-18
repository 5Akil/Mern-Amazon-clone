

import { createSlice } from "@reduxjs/toolkit";
import { basket } from "../../typesInterface/interface";


interface basketInterface {
    basket: basket[]
}

const initialState: basketInterface = {
    basket: localStorage.getItem("basket")
        ? JSON.parse(localStorage.getItem("basket")!)
        : [],
};

const basketSlice = createSlice({
    name: 'bucket',
    initialState,
    reducers: {
        add(state, action) {
            const index = state.basket.findIndex((item) => item.id === action.payload.id);
            if (index >= 0) {
                state.basket[index] = {
                    ...state.basket[index],
                    quantity: state.basket[index].quantity + 1,
                };
            } else {
                let temp = { ...action.payload, quantity: 1 };
                state.basket.push(temp);
            }
            localStorage.setItem('basket', JSON.stringify(state.basket))
        },
        remove(state, action) {

            state.basket = state.basket.filter((item) => item.id !== action.payload.id);
            localStorage.setItem('basket', JSON.stringify(state.basket))
        },
        increaseItem(state, action) {
            state.basket = state.basket.map((item) => {
                if (item.id === action.payload.id) {

                    return { ...item, quantity: item.quantity + 1 }
                };
                return item;
            });
            localStorage.setItem('basket', JSON.stringify(state.basket))
        },
        decreaseItem(state, action) {
            const itemIndex = state.basket.findIndex(
                (item) => item.id === action.payload.id
            );
            if (state.basket[itemIndex].quantity > 1) {
                state.basket[itemIndex].quantity -= 1;


            } else if (state.basket[itemIndex].quantity === 1) {
                const nextbasket = state.basket.filter(
                    (item) => item.id !== action.payload.id
                );
                state.basket = nextbasket;
            }
            localStorage.setItem('basket', JSON.stringify(state.basket))
        },
    },
});


export const { add, remove, increaseItem, decreaseItem, } = basketSlice.actions;
export default basketSlice.reducer;