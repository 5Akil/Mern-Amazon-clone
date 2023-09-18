import { faCcAmazonPay, faCcAmex, faCcDiscover, faCcMastercard, faCcVisa } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, Modal } from "react-bootstrap"
import { useMakePaymentIntentMutation, useMakePaymentMutation } from "../../services/checkoutService";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../Store/Slices/hooks";
import { useAddCardMutation } from "../../services/cardService";
import { useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";


type props = { show: boolean, onHide: () => void };
function CardModal({ show, onHide }: props) {
    const navigate = useNavigate()
    const { customerID } = useAppSelector((state) => state.user)
    console.log(customerID);



    const stripe = useStripe();
    const elements = useElements();
    const [makePaymentIntent, { data }] = useMakePaymentIntentMutation();
    const [addCard] = useAddCardMutation()
    const [error, setError] = useState<string | null>(null)
    const [nameOnCard, setNameOnCard] = useState<string | null>(null)
    const [isDefault, setIsDefault] = useState(false)

    const CARD_OPTIONS = {
        iconStyle: "solid",
        style: {
            base: {
                fontSize: '16px',
                color: '#000', // Text color
                backgroundColor: '#fff', // Background color
                fontFamily: 'Arial, sans-serif',
                '::placeholder': {
                    color: '#777', // Placeholder text color
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        },
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if (elements && nameOnCard) {
            console.log("click");
            
            const cardElements = elements.getElement(CardExpiryElement, CardNumberElement)

            const { token , error } = await stripe?.createToken(cardElements, { name: nameOnCard })
            console.log(token);
            console.log(error);
            
            
            if (token && customerID) {
                const body = {
                    token, customerID, nameOnCard, isDefault
                }
                const response = await addCard(body)
                console.log(response);
                
                if (response?.data) {
                    onHide()
                } else {
                    setError('Card already exists')
                }
            }else{
                console.log("error");
                
            }
        }

    }
    // const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElements });

    // // console.log(response, "////////////");
    // if (error) {
    //     console.log(error.message);
    // } else {
    //     console.log(paymentMethod);

    //     const body = {
    //         paymentMethod: paymentMethod
    //     }
    //     const response = await makePaymentIntent(body)
    //     console.log(response, "<++++");

    //     const result = await stripe.confirmCardPayment(response?.data?.clientSecret);
    //     console.log(result), "<<<<==========";

    // }



    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: 'rgb(234, 237, 237)' }}>
                    <Modal.Title style={{ fontSize: '18px' }}>Enter a card details</Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-column justify-content-center ' style={{ width: '800px' }} >
                    <div className='d-flex justify-content-between'>
                        <div className="p-3">
                            <form method='post' id="cardForm" onSubmit={handleSubmit}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td style={{ fontSize: "15px", color: "black" }}>Name on Card</td>
                                            <td align="right">
                                                <input type="text" name="name" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontSize: "15px", color: "black" }}>Card Number</td>
                                            <td align="right">
                                                <div className="FormGroup">
                                                    <CardNumberElement options={CARD_OPTIONS} />
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td style={{ fontSize: "15px", color: "black" }}>Expiry date </td>
                                            <td align="right">
                                                <div className="FormGroup">
                                                    <CardExpiryElement options={CARD_OPTIONS} />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="d-flex mt-3 ms-1 align-items-center ">
                                    <label htmlFor="default">
                                        <input type="checkbox" name='default' onChange={(e) => setIsDefault(true)} />
                                        <span className='m-3'>Make this card default</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="mt-4 ps-4 d-flex flex-column justify-content-center align-items-center" style={{ borderLeft: '1px solid #b4b4b4' }}>
                            <p>Amazon accepts all major credit and debit cards:</p>
                            <div className="icon_container ms-5">
                                <FontAwesomeIcon icon={faCcVisa} style={{ color: 'navy', fontSize: 30, marginRight: 10 }} />
                                <FontAwesomeIcon icon={faCcMastercard} style={{ color: 'red', fontSize: 30, marginRight: 10 }} />
                                <FontAwesomeIcon icon={faCcAmazonPay} style={{ color: '#cd9024', fontSize: 30, marginRight: 10 }} />
                                <FontAwesomeIcon icon={faCcDiscover} style={{ color: 'orange', fontSize: 30, marginRight: 10 }} />
                                <FontAwesomeIcon icon={faCcAmex} style={{ color: 'blue', fontSize: 30, marginRight: 10 }} />
                            </div>
                            {
                                error ?
                                    <div className="d-flex align-items-center">
                                        <FontAwesomeIcon className='me-2' icon={faCircleExclamation} fade style={{ color: 'red' }} />
                                        <span style={{ color: 'red' }}>{error}</span>
                                    </div>
                                    : null

                            }
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: 'rgb(234, 237, 237)' }}>
                    <Button style={{ backgroundColor: 'white', color: 'black', border: "none", marginRight: '20px' }} onClick={onHide}>
                        Cancel
                    </Button>
                    <Button form="cardForm" type="submit" style={{ backgroundColor: '#cd9024', border: 'none' }} >
                        Enter card details
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default CardModal