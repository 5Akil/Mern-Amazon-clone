import { createBrowserRouter } from "react-router-dom";
import HomePage from '../components/Home'
import Cart from '../components/Cart'
import Login from '../components/Login'
import Registration from '../components/Registration'
import Checkout from '../components/Checkout'
import VerifyEmail from '../components/VerifyEmail'
import Protected from "./Protected";

const MainRoutes =createBrowserRouter([

    {
        path : '/',
        element : <HomePage/>
    },
    {
        path : '/cart',
        element :<Cart/>   
    },
    {
        path : '/login',
        element : <Login/>
    },
    {
        path : '/registration',
        element : <Registration/>
    },
    {
        path : '/verify/:userId',
        element : <VerifyEmail/>
    },
    {
        path : '/checkout',
        element : <Protected  Component={Checkout} />  
    }
])
export default MainRoutes

