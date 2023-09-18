import { useEffect, useState } from "react";
import { useAppSelector } from "../Store/Slices/hooks";
import { item } from "../typesInterface/interface";
import { usePlaceOrderMutation } from "../services/checkoutService";
import { useNavigate } from "react-router";
import { useClearCartMutation } from "../services/cartService";
import { CardCvcElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface props {
    paymentSelected: string | null,
    selectedAddress: string,
    isApplied: boolean,
    activeKey: string,
    setActiveKey: React.Dispatch<React.SetStateAction<string>>,
    promotionalDiscount: number | null,
}

function OrderSummury
    ({ promotionalDiscount,
        selectedAddress,
        isApplied,
        activeKey,
        setActiveKey,
        paymentSelected,
        card,
    }: props) {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const [placeOrder] = usePlaceOrderMutation()
    const [clearCart] = useClearCartMutation()
    const data = useAppSelector((state) => state.checkout.checkout)
    const [message, setMessage] = useState<string>('')
    const totalCartAmount = data?.reduce(
        (total: number, item: item) => total + item.quantity * item?.productID?.price,
        0
    );
    const discount = (totalCartAmount) * promotionalDiscount! / 100

    const orderTotal = totalCartAmount - discount - (150 * 10) / 100

    const body = {
        paymentSelected,
        selectedAddress,
        data,
        orderTotal,
        card,
    }
    console.log(body, "body<==============");


    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (paymentSelected && selectedAddress && elements) {
            // const response = await stripe.createPaymentMethod({ type: 'card', card:{} });
            // console.log(response);


            const cardElements = elements.getElement(CardCvcElement)

            // const response = await stripe?.createToken(cardElements)
            // console.log(response);
            // const { error } = await stripe.createPaymentMethod({ type: 'card', card: cardElements });
            // console.log(error);



            const response = await placeOrder(body)

            // const result = await stripe.confirmCardPayment(response?.data?.clientSecret);
            // console.log(elements.getElement(CardCvcElement)), "<<<<==========";

            const result = await stripe.confirmCardPayment(response?.data?.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardCvcElement),
                },
            })
            console.log(result);

            //     if (response) {
            //         await clearCart()
            //         navigate ('/')
            //     }
        }

    }



    useEffect(() => {
        if (activeKey === '0') {
            setMessage('Choose a shipping address and payment method to calculate shipping,handling and tax.')
        } else if (activeKey === '1') {
            setMessage('Choose a payment method to continue checking out. You will still have chance to review and edit your order before it is final.')
        }

    }, [activeKey])
    return (
        <>
            <div className="card ">
                <div className="mt-4 d-flex flex-column">
                    {
                        activeKey === '0' ?
                            <>
                                <button className="checkoutBtn mx-auto" onClick={() => setActiveKey('1')}>
                                    Use This Address
                                </button>
                                <div className="card-title">
                                    <p style={{ fontSize: '12px', textAlign: 'center', padding: '15px 8px', borderBottom: "1px solid #b4b4b4" }}>{message} </p>
                                </div>
                            </>
                            : activeKey === '1' ?
                                <>
                                    <button className=" checkoutBtn mx-auto" onClick={() => { paymentSelected ? setActiveKey('2') : null }} disabled={paymentSelected ? false : true}>
                                        Use This payment
                                    </button>
                                    <div className="card-title">
                                        <p style={{ fontSize: '12px', textAlign: 'center', padding: '15px 8px', borderBottom: "1px solid #b4b4b4" }}>{message} </p>
                                    </div>
                                </>
                                :
                                <>
                                    <button className=" checkoutBtn mx-auto" onClick={handlePlaceOrder}>
                                        Place your order
                                    </button>
                                    <div className="card-title">
                                        <p style={{ fontSize: '12px', textAlign: 'center', padding: '15px 8px', borderBottom: "1px solid #b4b4b4" }}>By placing your order, you agree to Amazon$ &apos; <span> privacy notice</span> and <span>condition use</span> </p>
                                    </div>
                                </>
                    }
                </div>

                <div className="card-body">
                    <div className='cart_total'>
                        <p>Order Summury</p>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Shipping fee</td>
                                    <td align="right">₹ 150</td>
                                </tr>
                                <tr>
                                    <td>Discount 10%</td>
                                    <td align="right">-{(150 * 10) / 100}</td>
                                </tr>
                                <tr>
                                    <td>Price Total</td>
                                    <td align="right">{totalCartAmount}</td>
                                </tr>
                                {
                                    promotionalDiscount && isApplied ?
                                        <tr>
                                            <td>Promotion Applied  </td>
                                            <td align="right">-{discount}</td>
                                        </tr>
                                        :
                                        null
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td>Order Total</td>
                                    <td align="right">
                                        {orderTotal}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

            </div>
        </>
    )
}

export default OrderSummury