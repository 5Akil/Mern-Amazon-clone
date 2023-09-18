import { createSlice } from "@reduxjs/toolkit";

interface login {
    email: string | null,
    customerID:string | null,
    userName: string | null,
    isLoggedIn: boolean
}
const initialState: login = {
    email: null,
    customerID:null,
    userName:  null,
    isLoggedIn: false
}

const userAuthSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            if (action.payload) {
                console.log(action.payload);
                
                state.email = action.payload.email;
                state.customerID = action.payload.customerID
                state.userName = action.payload.userName;
                state.isLoggedIn = true; // Set isLoggedIn to true when the user logs in
            }
            else {
                state.email = null,
                state.userName = null,
                state.isLoggedIn = false; // Set isLoggedIn to false when the user logs out

            }
        }
    }
})


export const { setUser } = userAuthSlice.actions;

export default userAuthSlice.reducer;