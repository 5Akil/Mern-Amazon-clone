import "../styling/checkout.css"
import Footer from './common/Footer'
import { useGetCartItemsQuery } from '../services/cartService'
import { useEffect, useState } from "react"
import { useAppDispatch } from "../Store/Slices/hooks"
import CheckoutAccordion from "../components/CheckoutAccordion"
import CheckoutHeader from "./common/CheckoutHeader"
import { addItems } from "../Store/Slices/checkOutSlice"
import OrderSummury from "./OrderSummury"
import { address } from "../typesInterface/interface"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

function Checkout() {

    const dispatch = useAppDispatch()
    const { data, isLoading } = useGetCartItemsQuery({})
    const [promotionalDiscount, setPromotionalDiscount] = useState<number | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<address | null>(null);
    const [card, setCard] = useState<string | null>()
    const [paymentSelected, setPaymentSelected] = useState<string | null>(null);
    const [isApplied, setIsApplied] = useState(false);
    const [activeKey, setActiveKey] = useState<string>('0');

    useEffect(() => {
        if (data) {
            dispatch(addItems(data))
        }
    }, [data])
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    return (
        !isLoading ?
            <>
                <Elements stripe={stripePromise}>
                    <CheckoutHeader />
                    <div className='checkout_wrapper'>
                        <div className="container-fluied d-flex" style={{ backgroundColor: 'white', minHeight: '500px' }}>
                            <div className="left-col">
                                <CheckoutAccordion
                                    setPromotionalDiscount={setPromotionalDiscount}
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                    paymentSelected={paymentSelected}
                                    setPaymentSelected={setPaymentSelected}
                                    setIsApplied={setIsApplied}
                                    isApplied={isApplied}
                                    activeKey={activeKey}
                                    setActiveKey={setActiveKey}
                                    setCard={setCard}
                                    card={card}

                                />
                            </div>
                            <div className='right-col'>
                                <OrderSummury
                                    promotionalDiscount={promotionalDiscount}
                                    isApplied={isApplied}
                                    selectedAddress={selectedAddress}
                                    paymentSelected={paymentSelected}
                                    activeKey={activeKey}
                                    setActiveKey={setActiveKey}
                                    card={card}
                                />
                            </div>
                        </div>
                        <Footer />
                    </div >
                </Elements>
            </> : null
    )
}

export default Checkout





