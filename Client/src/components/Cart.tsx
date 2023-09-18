import React, { useEffect, useState } from "react";
import Header from "./common/Header";
import Footer from './common/Footer'
import Subtotal from "./Subtotal"
import '../styling/cart.css'
import { useDecrementQuentityMutation, useGetCartItemsQuery, useIncrementQuentityMutation, useRemoveItemMutation } from "../services/cartService";
import { useAppDispatch, useAppSelector } from "../Store/Slices/hooks";
import { decreaseItem, increaseItem, remove } from "../Store/Slices/cartSlice";
import { useNavigate } from "react-router";
import { basket, item } from "../typesInterface/interface";

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch();
    const [fetch, setFetch] = useState(false)
    
    const [incrementQuentity] = useIncrementQuentityMutation();
    const [decreaseItemQuantity] = useDecrementQuentityMutation();
    const [removeItem] = useRemoveItemMutation();
    const { data } = useGetCartItemsQuery(isLoggedIn, { skip: !fetch })
    const { basket } = useAppSelector((state) => state.basket)

    
    const products: Array<item> = data

    const incItem = async (item : any) => {
        if (isLoggedIn) {
            await incrementQuentity(item?.productID?.productID)
        } else {
            dispatch(increaseItem(item))
        }
    }
    const decItem = async (item : any) => {
        if (isLoggedIn) {
            await decreaseItemQuantity(item?.productID?.productID)
        } else {
            dispatch(decreaseItem(item))
        }

    }
    const handleLogin = () => {
        navigate('/login')
    }

    const handleRegister = () => {
        navigate('/registration')
    }


    useEffect(() => {
        if (isLoggedIn) { setFetch(true) }
    }, [isLoggedIn])
    
    return (
        <>
            <Header />
            <div className="checkout">
                <div className="checkout_left">
                    <img
                        className="checkout_ad"
                        src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
                    />

                    {
                        isLoggedIn ?
                            <>
                                {products?.length === 0 ? (
                                    <div>
                                        <h2>Your Shopping Cart is empty</h2>
                                        <p>
                                            You have no item in your basket. To buy one or more items ,
                                            click "Add to Cart" next to the item.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="checkout_title">Checkout Your Shopping Cart</h2>
                                        {products?.map((item) => (

                                            <>
                                                <div className="checkoutProduct" key={item?.productID?.productID}>
                                                    <img className="checkoutProduct_image" src={item?.productID?.image} alt="" />
                                                    <div className="checkoutProduct_info">
                                                        <p className="checkoutProduct_title">{item?.productID?.title}</p>
                                                        <p className="checkoutProduct_price">
                                                            <small>₹</small>
                                                            <strong>{item?.productID?.price}</strong>
                                                        </p>
                                                        <div className="num-block btn">
                                                            <div className="num-in">
                                                                <span onClick={() => decItem(item)} className="minus dis"></span>
                                                                <p style={{margin:'0px'}}>{item?.quantity}</p>
                                                                <span onClick={() => {
                                                                    incItem(item)
                                                                }} className="plus"></span>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => removeItem(item?.productID?.productID)}  ><h5>Remove from cart</h5></button>
                                                    </div>
                                                </div></>
                                        ))}
                                    </div>
                                )}
                            </> :
                            <>
                                {basket?.length === 0 ? (
                                    <div>
                                        <h2>Your Shopping Cart is empty</h2>
                                        <p>
                                            You have no item in your basket. To buy one or more items ,
                                            click "Add to Cart" next to the item.
                                        </p>
                                        <button type="button" className="cart_btn login_btn px-2" onClick={handleLogin} >
                                            <h5>
                                                Sign in to your account
                                            </h5>
                                        </button>
                                        <button type="button" className="cart_btn px-2 " onClick={handleRegister} >
                                            <h5>
                                                Sign up now
                                            </h5>
                                        </button>

                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="checkout_title">Checkout Your Shopping Cart</h2>
                                        {basket?.map((item : basket) => (
                                            <>
                                                <div className="checkoutProduct" key={item?.id}>
                                                    <img className="checkoutProduct_image" src={item?.image} alt="" />
                                                    <div className="checkoutProduct_info">
                                                        <p className="checkoutProduct_title">{item?.title}</p>
                                                        <p className="checkoutProduct_price">
                                                            <small>₹</small>
                                                            <strong>{item?.price}</strong>
                                                        </p>

                                                        {/* quantity field   */}
                                                        <div className="num-block btn">
                                                            <div className="num-in">
                                                                <span onClick={() => decItem(item)} className="minus dis"></span>
                                                                <p className="qty">{item?.quantity}</p>
                                                                <span onClick={() => {
                                                                    incItem(item)
                                                                }} className="plus"></span>
                                                            </div>
                                                        </div>

                                                        <button onClick={() => dispatch(remove(item))}>Remove form Cart</button>
                                                    </div>
                                                </div></>
                                        ))}
                                    </div>
                                )}

                            </>

                    }
                </div>
                <div className="checkout_right">
                    <Subtotal isLoggedIn={isLoggedIn} products={isLoggedIn ? data : basket} />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Cart;