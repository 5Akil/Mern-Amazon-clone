import { useFormik } from 'formik';
import '../styling/login.css'
import { Link } from 'react-router-dom'
import { registrationSchema } from '../validationSchema/registrationSchema';
import { useRegistrationMutation } from '../services/userService';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function registration() {
    const [messege, setMessage] = useState('')
    const [mailSend, setMailSend] = useState(false);

    const [registration, { status }] = useRegistrationMutation();
    const { touched, handleBlur, handleChange, handleSubmit, values, errors } = useFormik({
        initialValues: {
            userName: '',
            email: '',
            password: '',
            confirm_password: ''
        },
        validationSchema: registrationSchema,
        onSubmit: async (values, action) => {
            const body = {
                email: values.email,
                userName: values.userName,
                password: values.password
            }
            await registration(body)
            action.resetForm();
        }
    })
    useEffect(() => {
        if (status === 'fulfilled') {
            setMailSend(true)
            setMessage("Email has been sent, please check your inbox")
        } else if (status === 'rejected') {
            setMessage("This Email is ALready registered ,try different one")
        }
    }, [status])

    return (

        <div className="login">
            <Link to="/">
                <img
                    className="login_logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
                    alt=""
                />
            </Link>
            <div className="login_container ">
                {
                    !mailSend ?
                        <>
                            {/* <div className='text-center'> */}
                            {
                                messege.length !== 0 ?
                                    <>
                                        <FontAwesomeIcon icon={faEnvelope} fade style={{ color: "#E31837", fontSize: "80px" }} />
                                        <h4>{messege}</h4>
                                    </>
                                    :
                                    null
                            }
                            {/* </div> */}
                            <h1>Create account</h1>
                            <form  method='post' onSubmit={handleSubmit} >
                                <h5>Your name</h5>
                                <input
                                    type="text"
                                    name='userName'
                                    placeholder='First and last name'
                                    value={values.userName}
                                    onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.userName && touched.userName ? (
                                    <span className="form-error" style={{ color: 'red' }}>{errors.userName}</span>
                                ) : null}
                                <h5>E-mail</h5>
                                <input
                                    type="email"
                                    name='email'
                                    placeholder='email'
                                    value={values.email}
                                    onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.email && touched.email ? (
                                    <span className="form-error" style={{ color: 'red' }}>{errors.email}</span>
                                ) : null}
                                <h5>Password</h5>
                                <input
                                    type="password"
                                    name='password'
                                    placeholder='At least 8 characters'
                                    value={values.password}
                                    onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.password && touched.password ? (
                                    <span className="form-error" style={{ color: 'red' }}>{errors.password}</span>
                                ) : null}
                                <h5>Re-enter password</h5>
                                <input
                                    type="password"
                                    name='confirm_password'
                                    value={values.confirm_password}
                                    onChange={handleChange} onBlur={handleBlur}
                                />
                                {errors.confirm_password && touched.confirm_password ? (
                                    <span className="form-error" style={{ color: 'red' }}>{errors.confirm_password}</span>
                                ) : null}

                                <button className="login_signInButton " type='submit' >
                                    Create Account
                                </button>
                            </form>
                        </> :

                        <>
                            <FontAwesomeIcon icon={faEnvelope} fade style={{ color: "green", fontSize: "80px" }} />
                            <h4 className='text-center'>{messege}</h4>
                        </>
                }

            </div>
        </div>
    )
}

export default registration