// import Button from 'react-bootstrap/Button';
import '../../styling/modal.css'
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { checkOutSchema } from '../../validationSchema/checkoutValidation';
import { useAddAddressMutation, useGetAddressQuery, useEditAddressMutation } from '../../services/addressService';
import { address, states } from '../../typesInterface/interface';
type props = { show: boolean, onHide: () => void, id: number | null , setModalID: (id: number | null) => void, setSelectedAddress: (data: address | null) => void };
const ModalBox = (props: props) => {

    const [countries, setCounties] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('')
    const [states, setStates] = useState<states[] | null>(null);
    const [cities, setCities] = useState<string[] | null>(null);
    const { data } = useGetAddressQuery(props.id, { skip: !props.show })
    const [addAddress] = useAddAddressMutation();
    const [editAddress , {data:edited}] = useEditAddressMutation();

    const getAllCountries = async () => {
        const response = await fetch("https://countriesnow.space/api/v0.1/countries/states")
        const result = await response.json()
        const countries = result?.data?.map((item: { name: String }) => {
            return item.name
        })
        setCounties(countries)
    }
    const getSingleAddress = async () => {
        const result: address = data?.address
        setFieldValue('userName', `${result?.userID?.userName}`)
        setFieldValue('address', `${result?.address}`)
        setFieldValue('pincode', `${result?.postalCode}`)
        setFieldValue('city', ``)
    }
    useEffect(() => {
        getAllCountries();
    }, [])
    useEffect(() => {

        if (props.id !== null) {
            getSingleAddress()
        }
    }, [data])
    const handleSelectedCountry = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target

        if (value?.length === 0) {
            setSelectedCountry(''),
                setCities(null);
            setStates(null);
            setSelectedState('')
            setFieldValue('state', '')
            setFieldValue('city', '')
        } else {
            setCities(null);
            setStates(null);
            setFieldValue('state', ''),
                setFieldValue('city', ''),
                handleChange(e)
            setSelectedCountry(value)
            const data = {
                "country": value
            }
            const response = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const result = await response.json()

            if (result?.data?.states?.length !== 0) {
                setStates(result?.data?.states)
            } else {
                setStates(null)
                setCities(null)
                setSelectedState('')
                setSelectedCountry('')
            }
        }
    }
    const handleSelectedState = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target

        if (value?.length === 0) {
            setSelectedState('')
        } else {
            setFieldValue('city', '')
            handleChange(e)
            setSelectedState(value)
            const data = {
                "country": selectedCountry,
                "state": value
            }
            const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
                method: 'post',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const cities = await response.json()

            if (cities?.data?.length !== 0) {
                setCities(cities?.data)
            } else {
                setCities(null);
                setSelectedState('')
            }
        }
    }

    const initialValues =
    {
        userName: '',
        address: "",
        country: "",
        state: "",
        city: "",
        mobile_number: "",
        pincode: "",
        defaultValue: false,
    };
    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: checkOutSchema(states, cities),
            onSubmit: async (values, action) => {
                const { userName, address, country, state, city, pincode, defaultValue } = values
                const body = {
                    id: props?.id !== null ? props.id : null,
                    address: `${address}`,
                    city: `${city}`,
                    userName: userName,
                    state: state,
                    country: country,
                    postalCode: pincode,
                    defaultValue: defaultValue
                }
                if (props.id !== null) {
                     await editAddress(body)
                    props.setSelectedAddress(edited)
                } else {
                    await addAddress(body)                 // Registration Query Hook
                }
                action.resetForm();
                props.onHide();
            },
        });

    return (

        <Modal {...props}>
            <Modal.Header closeButton style={{ backgroundColor: 'rgb(234, 237, 237)' }}>
                <Modal.Title style={{ fontSize: '18px' }}>Enter a new delivery address</Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex flex-column justify-content-center' >
                <h5>
                    Add a new address
                </h5>
                <div className='form_container' >

                    <form method='post' onSubmit={handleSubmit} >
                        <h5>Country / Region</h5>
                        <select name='country' value={values.country} onChange={handleSelectedCountry}>
                            <option value="" >Country</option>
                            {
                                countries?.length !== 0 ?
                                    countries?.map((item) => {
                                        return <>
                                            <option key={item} value={item} >{item} </option>
                                        </>
                                    })
                                    :
                                    null
                            }
                        </select>
                        {errors.country && touched.country ? (
                            <span className="form-error" style={{ color: 'red' }}>{errors.country}</span>
                        ) : null}
                        <h5>Full name (First and Last name)</h5>
                        <input
                            type="text"
                            name='userName'
                            value={values.userName}
                            onChange={handleChange} onBlur={handleBlur}
                        />
                        {errors.userName && touched.userName ? (
                            <span className="form-error" style={{ color: 'red' }}>{errors.userName}</span>
                        ) : null}
                        <h5>Mobile number</h5>
                        <input
                            type="text"
                            name='mobile_number'
                            value={values.mobile_number}
                            onChange={handleChange} onBlur={handleBlur}
                        />
                        {errors.mobile_number && touched.mobile_number ? (
                            <span className="form-error" style={{ color: 'red' }}>{errors.mobile_number}</span>
                        ) : null}
                        <h5>Pincode</h5>
                        <input
                            type="pincode"
                            name='pincode'
                            value={values.pincode}
                            onChange={handleChange} onBlur={handleBlur}
                        />
                        {errors.pincode && touched.pincode ? (
                            <span className="form-error" style={{ color: 'red' }}>{errors.pincode}</span>
                        ) : null}
                        <h5>Flat,House no.,Building,Company,Apartment</h5>
                        <input
                            type="text"
                            name='address'
                            value={values.address}
                            onChange={handleChange} onBlur={handleBlur}
                        />
                        {errors.address && touched.address ? (
                            <span className="form-error" style={{ color: 'red' }}>{errors.address}</span>
                        ) : null}
                        <h5>Area,street,sector,village</h5>
                        <input
                            type="text"
                            name='landmark'

                        />

                        <h5>Landmark</h5>
                        <input
                            type="text"
                            name='landmark'
                            placeholder='E.g near apollo hospital'

                        />

                        <div className='d-flex '>
                            <div style={{ flex: '50%' }}>

                                <h5 >State</h5>
                                <select name='state' onChange={handleSelectedState} disabled={selectedCountry?.length === 0 ? true : false}
                                >
                                    <option value="" >State</option>
                                    {
                                        countries?.length !== 0 ?
                                            states?.map((item) => {

                                                return <>
                                                    <option key={item.name} value={item.name} >{item.name} </option>
                                                </>
                                            })
                                            :
                                            null
                                    }
                                </select>
                                {errors.state && touched.state ? (
                                    <p className="form-error" style={{ color: 'red' }}>{errors.state}</p>
                                ) : null}
                            </div>
                            <div style={{ flex: '50%' }}>

                                <h5 >city</h5>
                                <select name='city' onChange={handleChange} disabled={selectedState?.length === 0 ? true : false}
                                >
                                    <option value="" >Cities</option>
                                    {
                                        countries?.length !== 0 ?
                                            cities?.map((item) => {
                                                return <>
                                                    <option key={item} value={item} >{item} </option>
                                                </>
                                            })
                                            :
                                            null
                                    }
                                </select>
                                {errors.city && touched.city ? (
                                    <p className="form-error" style={{ color: 'red' }}>{errors.city}</p>
                                ) : null}
                            </div>
                        </div>
                        <div style={{ margin: "10px 0px" }}>
                            <label htmlFor="defaultValue">
                                <input type="checkbox" name='defaultValue' onChange={handleChange} />
                                <span className='m-3'>Make this address default</span>
                            </label>
                        </div>
                        <button type='submit' className='form_button'>
                            Use this address
                        </button>
                    </form>
                </div>
            </Modal.Body>
        </Modal>


    )
}

export default ModalBox