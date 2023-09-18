import '../styling/accordion.css'
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faCircleCheck, faCircleExclamation, faCreditCard, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import ModalBox from './common/Modal';
import CardModal from './common/CardModal';
import { faCcAmazonPay, faCcAmex, faCcDiscover, faCcMastercard, faCcVisa } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../Store/Slices/hooks';
import { useGetAllAddressQuery } from '../services/addressService';
import { address, item } from '../typesInterface/interface';
import { useVerifyPromotionalCodeMutation } from '../services/checkoutService';
import { updateCartItemQuantity } from '../Store/Slices/checkOutSlice';
import { useRemoveItemMutation } from '../services/cartService';
import { useNavigate } from 'react-router';
import { CardCvcElement, useElements } from '@stripe/react-stripe-js';
import { useGetCardsQuery } from '../services/cardService';
import { useFormik } from 'formik';

interface props {
    selectedAddress: address | null,
    paymentSelected: string | null,
    isApplied: boolean,
    activeKey: string,
    setIsApplied: React.Dispatch<React.SetStateAction<boolean>>,
    setActiveKey: React.Dispatch<React.SetStateAction<string>>,
    setSelectedAddress: React.Dispatch<React.SetStateAction<address | null>>,
    setPaymentSelected: React.Dispatch<React.SetStateAction<string | null>>,
    setPromotionalDiscount: React.Dispatch<React.SetStateAction<number | null>>;
}
function CheckoutAccordion
    ({
        selectedAddress,
        paymentSelected,
        isApplied,
        activeKey,
        setIsApplied,
        setActiveKey,
        setSelectedAddress,
        setPaymentSelected,
        setPromotionalDiscount,
        setCard,
        card,

    }: props) {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const data = useAppSelector((state) => state.checkout.checkout)
    const { userName, isLoggedIn, customerID } = useAppSelector((state) => state.user)
    const [addressModal, setAddressModal] = useState<boolean>(false)
    const [cardModal, setCardModal] = useState<boolean>(false)
    const [modalID, setModalID] = useState<number | null>(null)
    // const [card, setCard] = useState<string | null>()
    // console.log(card, "<<<<<<<card");
    console.log(paymentSelected, "payment");


    const [user, setuser] = useState(false)
    const [code, setCode] = useState<string | null>(null)
    const { data: address } = useGetAllAddressQuery(isLoggedIn, { skip: !user })
    const [verifyPromotionalCode, { data: codeResponse, error }] = useVerifyPromotionalCodeMutation()
    const [removeItem] = useRemoveItemMutation()
    const { data: cards } = useGetCardsQuery(customerID, { skip: !user })

    useEffect(() => {
        if (cards?.length !== 0) {
            const defaultCard = cards?.[0];
            setCard(defaultCard)
        }
    }, [cards])


    const totalCartAmount = data?.reduce(
        (total: number, item: item) => total + item.quantity * Number(item?.productID?.price),
        0
    );
    const handleCode = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (code !== null) {
            const body = {
                code: code
            }
            const response = await verifyPromotionalCode(body)
            if (response?.error) {
                setIsApplied(false)
            } else {
                setIsApplied(true)
            }
        }
    }
    const handleAddressSelect = (item: address) => {
        setSelectedAddress(item);
    }
    const handlePaymentSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setPaymentSelected(value)
    }
    const handleEdit = (id: number) => {
        setModalID(id)
        setAddressModal(true)
    }
    const handleCardSelected = (item) => {
        // const { value } = e.target
        setCard(item)
    }

    type ItemQuantities = Record<number, string>;
    const [itemQuantities, setItemQuantities] = useState<ItemQuantities>({});
    const handleQTY = (itemId: number, quantity: string) => {
        const updatedQuantities = { ...itemQuantities, [itemId]: quantity };
        setItemQuantities(updatedQuantities);
        dispatch(updateCartItemQuantity({ itemId, quantity }));
    };
    useEffect(() => {
        if (address) {
            const defaultAddress = address?.address.filter((item: address) => {
                return item.isDefault
            })
            setSelectedAddress(defaultAddress[0]);
        }
    }, [address])
    useEffect(() => {
        if (isLoggedIn) {
            setuser(true)
        }
    }, [isLoggedIn])
    useEffect(() => {
        if (totalCartAmount > 0 && isApplied) {
            setPromotionalDiscount(codeResponse?.discountPercentage)
        } else {
            setPromotionalDiscount(null)
        }
    }, [totalCartAmount, codeResponse, isApplied]);


    const handleRemove = async (id: number) => {
        console.log(id);

        await removeItem(id)
        if (data?.length === 1) {
            navigate('/cart')
        }
    }

    const CARD_OPTIONS = {
        iconStyle: "solid",
        style: {
            base: {
                width: '100px',
                fontSize: '16px',
                color: '#000', // Text color
                backgroundColor: '#fff', // Background color
                fontFamily: 'Arial, sans-serif',

            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
            cvc: {
                maxLength: 3, // Change this value to your desired maximum length
            },
        },
    }

    const elements = useElements()
    const element = elements?.getElement(CardCvcElement)


    // const handlePayment = async (e) => {
    //     e.preventDefault();
    //     console.log(paymentSelected);

    //     console.log(element);
    //     // if (paymentSelected === 'card' && element) {
    //         // const cvc = elements?.getElement(CardCvcElement)


    //         // }

    //     }

    const handleCvc = (elementData) => {

        console.log(element);

        console.log(elementData);
        if (!elementData.complete && !elementData.error) {
            console.log(`Your cvc is incomplete or invalid.`);

            if (card === "Visa") {
                console.log(card);
                elementData.error.message = "exiceded"

            }

        } else if (elementData.complete && !elementData.error) {
            console.log('success');
        }
    }
        ;


    return (
        <>
            <Accordion activeKey={[activeKey]} alwaysOpen >
                <Accordion.Item eventKey="0" >
                    <Accordion.Header style={{ borderBottom: '1px solid rgb(180, 180, 180)' }}>
                        <div className=' d-flex justify-content-between'>
                            <div>
                                {activeKey !== '0' ? <p> 1&nbsp; &nbsp;  Delivery Address </p> : <p> 1 &nbsp; &nbsp; Select your delivery address </p>}
                            </div>
                            <div style={{ width: "300px" }}>
                                {activeKey !== '0' ?
                                    `${userName} ,
                                     ${selectedAddress?.address}, 
                                    ${selectedAddress?.state}, 
                                    ${selectedAddress?.country}-${selectedAddress?.postalCode}`
                                    :
                                    null
                                }
                            </div>
                            <div>
                                {selectedAddress && activeKey === '0' ?
                                    <>
                                        <a className="card-link " style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer' }} onClick={() => setActiveKey('1')}>Close&nbsp;<FontAwesomeIcon icon={faXmark} style={{ color: 'black' }} /></a>
                                    </>
                                    :
                                    selectedAddress ?
                                        <a className="card-link " style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer' }} onClick={() => setActiveKey('0')}>Change</a>
                                        : null
                                }
                            </div>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className='card'>
                            <div className="card-body">
                                {
                                    <>
                                        <h5 className="card-title mb-3" style={{ paddingBottom: '5px', borderBottom: "1px solid rgba(0,0,0,.125)" }}>Your address</h5>
                                        <div className=' mb-3' >
                                            <div className='d-flex flex-column '>
                                                {
                                                    address ?
                                                        address?.address?.map((item: address, index: number) => {
                                                            return < >
                                                                <label key={index} htmlFor="address" className='p-3 m-1'>
                                                                    <input type="radio" name='address' id={`address-${index}`} checked={selectedAddress === item ? true : false} onChange={() => handleAddressSelect(item)} />
                                                                    <span className='ps-3'>
                                                                        {item?.address},   {item?.city?.length !== 0 ? `${item?.city},` : null} {item?.state?.length !== 0 ? `${item?.state},` : null} {item?.country}-{item?.postalCode}
                                                                    </span>
                                                                    <div className='ms-3 ps-3'>
                                                                        <a className="card-link " style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer', fontSize: "12px" }} onClick={() => handleEdit(item.id)}>Edit address</a>
                                                                    </div>
                                                                </label>
                                                            </>
                                                        })
                                                        :
                                                        null
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <FontAwesomeIcon icon={faPlus} style={{ color: 'rgba(0,0,0,.125)', paddingRight: "10px" }} />
                                            <a className="card-link " style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer' }} onClick={() => setAddressModal(true)}>Add a new address</a>
                                        </div>
                                    </>
                                }
                            </div>
                            {
                                address?.address?.length !== 0 && selectedAddress ?

                                    <div className="card-footer ">
                                        <button type='button' className='acoordionBtn' onClick={() => setActiveKey('1')}> use this address</button>
                                    </div> : null
                            }
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header style={{ borderBottom: '1px solid rgb(180, 180, 180)' }}>

                        <div className=' d-flex justify-content-between'>
                            <div>
                                {activeKey !== '1' ? <p> 2  &nbsp; &nbsp; Payment Method</p> : <p>2 &nbsp; &nbsp; Select a payment method </p>}
                            </div>
                            <div style={{ width: "300px" }}>
                                {activeKey !== '1' && paymentSelected ?
                                    <>
                                        <div>
                                            {paymentSelected === 'card' ? <p style={{ fontSize: '15px' }}> <span style={{ textDecoration: "none", fontWeight: '600' }} >{card?.brand} </span>ending in  <span style={{ color: "#067D62" }}>{card?.last4}</span> </p> :
                                                paymentSelected === 'EMI' ? <p> EMI </p> :
                                                    paymentSelected === 'COD' ? <p> Cash on Delivery / Pay on Delivery</p> : null}
                                        </div>
                                        <div>

                                        </div>
                                        <h5 className="card-title mb-3" style={{ fontSize: '12px' }}>Add a gift card or promotional code</h5>
                                        <div className='mb-3'>
                                            {
                                                isApplied && !error ?
                                                    <div className='d-flex align-items-center'>
                                                        <FontAwesomeIcon icon={faCircleCheck} fade style={{ color: 'green' }} />
                                                        <span className='ms-3'> Promo code applied</span>
                                                        <a className="card-link ms-2" style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer', fontSize: "12px" }} onClick={() => setIsApplied(false)}> Remove </a>

                                                    </div>
                                                    :
                                                    <form onSubmit={handleCode}>
                                                        <input type="text" style={{ borderRadius: '7px', width: '120px' }} onChange={(e) => setCode(e.target.value)} />
                                                        <button type='submit' className='ms-3 p-1' style={{ borderRadius: '7px', border: 'none', fontSize: '15px' }} >Apply</button>
                                                        {error ?
                                                            <div className='mt-2'>
                                                                <FontAwesomeIcon className='me-2' icon={faCircleExclamation} fade style={{ color: 'red' }} />
                                                                <span className='' style={{ fontSize: '12px', color: 'red' }}>The promotional code you entered is not valid</span>
                                                            </div>
                                                            : null}
                                                    </form>
                                            }
                                        </div>
                                    </>
                                    :
                                    null
                                }
                            </div>
                            <div>
                                {paymentSelected && activeKey === '1' ?
                                    <a className="card-link " style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer' }} onClick={() => setActiveKey('2')}>Close&nbsp;<FontAwesomeIcon icon={faXmark} style={{ color: 'black' }} /></a>
                                    :
                                    paymentSelected ?
                                        <a className="card-link " style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer' }} onClick={() => setActiveKey('1')}>Change</a>
                                        : null
                                }
                            </div>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className='card'>
                            <div className="card-body">
                                <h5 className="card-title mb-3" style={{ paddingBottom: '5px', borderBottom: "1px solid rgba(0,0,0,.125)" }}>Add a gift card or promotional code</h5>
                                <div className='mb-3'>
                                    {
                                        isApplied && !error ?
                                            <div className='d-flex align-items-center'>
                                                <FontAwesomeIcon icon={faCircleCheck} fade style={{ color: 'green' }} />
                                                <span className='ms-3'> Promo code applied</span>
                                                <a className="card-link ms-2" style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer', fontSize: "12px" }} onClick={() => setIsApplied(false)}> Remove </a>

                                            </div>
                                            :
                                            <form onSubmit={handleCode}>
                                                <input type="text" style={{ borderRadius: '7px', width: '7rem' }} onChange={(e) => setCode(e.target.value)} />
                                                <button type='submit' className='ms-3 p-1' style={{ borderRadius: '7px', border: 'none', fontSize: '15px' }} >Apply</button>
                                                {error ?
                                                    <div className='mt-2'>
                                                        <FontAwesomeIcon className='me-2' icon={faCircleExclamation} fade style={{ color: 'red' }} />
                                                        <span className='' style={{ fontSize: '12px', color: 'red' }}>The promotional code you entered is not valid</span>
                                                    </div>
                                                    : null}
                                            </form>
                                    }
                                </div>
                                {
                                    paymentSelected === 'card' && cards?.length !== 0 ?
                                        <>
                                            <h5 className="card-title mb-3" style={{ paddingBottom: '5px', borderBottom: "1px solid rgba(0,0,0,.125)" }}>Credit & Debit Cards</h5>
                                            <div className=' mb-3' >
                                                <div className='d-flex flex-column '>
                                                    {
                                                        cards?.map((item) => {
                                                            return <>
                                                                <div key={item.id} className='d-flex flex-column ps-3 m-2'>
                                                                    <div className='d-flex '>
                                                                        <div style={{ flex: '0.8' }}>
                                                                            <input type="radio" name='card' checked={item.id === card?.id ? true : false} onChange={() => handleCardSelected(item)} />
                                                                            <span className='ms-3' style={{ textDecoration: "none", fontWeight: '600' }} >{item.brand} </span>ending in  <span style={{ color: "#067D62" }}>{item.last4}</span>
                                                                            <div className='ps-3 ms-1'>
                                                                                {/* <a className="card-link ms-2" style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer', fontSize: "12px" }}
                                                                                    onClick={() => handleRemove(item?.productID?.productID)}> Remove </a> */}
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ flex: '0.2' }}>
                                                                            {item.name}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        {
                                                                            card?.id === item.id ?
                                                                                <form className='d-flex align-items-center mt-3' id='abcd'>
                                                                                    <label htmlFor='cvc' className='ps-4 me-2' style={{ fontSize: '0.8rem' }}>
                                                                                        CVC :  </label>
                                                                                    <div style={{ width: "5rem" }} id='card_element'>
                                                                                        <input type="text" onChange={handleCvc} />
                                                                                        {/* <CardCvcElement id='cvc' className='form-control' options={CARD_OPTIONS} onChange={handleCvc} /> */}
                                                                                    </div>
                                                                                </form>
                                                                                : null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </>
                                        :
                                        null
                                }
                                <h5 className="card-title mb-3" style={{ paddingBottom: '5px', borderBottom: "1px solid rgba(0,0,0,.125)" }}>Payment method</h5>
                                <div >
                                    <div className='d-flex flex-column '>
                                        <div>
                                            <label className='p-3 m-1'>
                                                <input type="radio" name='payment' value='card' onChange={(e) => handlePaymentSelected(e)} />
                                                <span className='ps-3'>
                                                    Credit or debit card
                                                </span>
                                            </label>
                                            <div className="icon_container ms-5">
                                                <FontAwesomeIcon icon={faCcVisa} style={{ color: 'navy', fontSize: 30, marginRight: 10 }} />
                                                <FontAwesomeIcon icon={faCcMastercard} style={{ color: 'red', fontSize: 30, marginRight: 10 }} />
                                                <FontAwesomeIcon icon={faCcAmazonPay} style={{ color: '#cd9024', fontSize: 30, marginRight: 10 }} />
                                                <FontAwesomeIcon icon={faCcDiscover} style={{ color: 'orange', fontSize: 30, marginRight: 10 }} />
                                                <FontAwesomeIcon icon={faCcAmex} style={{ color: 'blue', fontSize: 30, marginRight: 10 }} />
                                            </div>
                                            {
                                                paymentSelected === 'card' ? <>
                                                    <div className='ms-4'>
                                                        <FontAwesomeIcon icon={faPlus} style={{ color: 'rgba(0,0,0,.125)', paddingRight: "10px" }} />
                                                        <FontAwesomeIcon icon={faCreditCard} style={{ color: 'black', paddingRight: "10px" }} />
                                                        <a className="card-link " style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer' }} onClick={() => setCardModal(true)}>Enter Card Details &gt; <span style={{ color: 'black', fontSize: '12px' }}>Amazon accepts all major  Credit & cards</span></a>
                                                    </div>
                                                </> : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div >
                                    <div className='d-flex flex-column '>
                                        <div>
                                            <label className='ps-3 pt-2 m-1'>
                                                <input type="radio" name='payment' value='EMI' onChange={(e) => handlePaymentSelected(e)} />
                                                <span className='ps-3'>
                                                    EMI
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div >
                                    <div className='d-flex flex-column '>
                                        <div>
                                            <label className='ps-3 pt-2 m-1'>
                                                <input type="radio" name='payment' value="COD" onChange={(e) => handlePaymentSelected(e)} />
                                                <span className='ps-3'>
                                                    Cash on Delivery / Pay on Delivery
                                                </span>
                                            </label>
                                            <div className='ms-4'>
                                                <p className="card-link ps-4" style={{ color: 'black', fontSize: '12px' }}>Cash ,UPI and Cards accepted</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                paymentSelected ? <>

                                    <div className="card-footer ">
                                        <button type='button' className='acoordionBtn' onClick={() =>
                                            paymentSelected && card ? setActiveKey('2') : null}
                                            disabled={paymentSelected ? false : true}> use this Payment</button>
                                    </div>
                                </> : null
                            }
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header style={{ borderBottom: '1px solid rgb(180, 180, 180)' }}>3 &nbsp; &nbsp; Review items and delivery</Accordion.Header>
                    <Accordion.Body>
                        <div className='card'>
                            <div className="summury">
                                <h3>Cart Summary</h3>
                                <div className="cart_icon">
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span  >{data?.length}</span>
                                </div>
                            </div>
                            <div className="wrapper">
                                {
                                    data?.map((item: item) => {
                                        return <>
                                            <div className="checkProduct" >
                                                <div>
                                                    <img className="image" src={item?.productID?.image} alt="" />
                                                </div>
                                                <div className="info">
                                                    <p className="productTitle">{item?.productID?.title}</p>
                                                    <div className="d-flex justify-content-around mt-2">
                                                        <p className="checkoutProduct_price">
                                                            <small>₹</small>
                                                            <strong>{item?.productID?.price}</strong>
                                                        </p>
                                                        <div className="checkoutProduct_price d-flex align-items-center">
                                                            <small>Qty:</small>

                                                            <select className='qty' style={{ padding: '5px', marginLeft: '5px' }} onChange={(e) => handleQTY(item?.productID?.productID, e.target.value)} value={itemQuantities[item?.productID?.productID] || item?.quantity}  >
                                                                <option value='1' >1</option>
                                                                <option value='2'>2</option>
                                                                <option value='3'>3</option>
                                                                <option value='4'>4</option>
                                                                <option value='5'>5</option>
                                                                <option value='6'>6</option>
                                                                <option value='7'>7</option>
                                                                <option value='8'>8</option>
                                                                <option value='9'>9</option>
                                                                <option value='10'>10</option>
                                                            </select>
                                                            <a className="card-link ms-2" style={{ textDecoration: "none", color: "#067D62", cursor: 'pointer', fontSize: "12px" }}
                                                                onClick={() => handleRemove(item?.productID?.productID)}> Remove </a>
                                                        </div>
                                                        <p className="checkoutProduct_price">
                                                            <small>Total:</small>
                                                            <strong>{item.quantity * Number(item?.productID?.price)}</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div >
                                        </>
                                    })
                                }
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion >


            <ModalBox show={addressModal} onHide={() => setAddressModal(false)} id={modalID} setModalID={setModalID} setSelectedAddress={setSelectedAddress} />

            <CardModal show={cardModal} onHide={() => setCardModal(false)} />

        </>
    );
}

export default CheckoutAccordion;