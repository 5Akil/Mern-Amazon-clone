import React, { useEffect, useState } from 'react'
import '../styling/login.css'
import { Link,useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useLoginUserMutation } from '../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch } from '../Store/Slices/hooks';
import { setUser } from '../Store/Slices/userAuth';
import { loginValidation } from '../validationSchema/loginValidation';

const Login: React.FC = () => {
  interface FormValues {
    email: string,
    password: string
  }
  const initialValues: FormValues = {
    email: '',
    password: ''
  };
  const dispatch = useAppDispatch()

  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const [errorMessege, setErrorMessege] = useState('');
  const register = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    navigate('/registration')
  };

  const { touched, handleBlur, handleChange, handleSubmit, errors, values } = useFormik({
    initialValues,
    validationSchema: loginValidation,
    onSubmit: async (values, action) => {
      await loginUser(values)

      const response = await loginUser(values)
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response?.data?.user));
        const body = {
          email : response?.data?.user?.email ,
          customerID : response?.data?.user?.customerID, 
          userName :  response?.data?.user?.userName ,
          isLoggedIn: true
        }
        dispatch(setUser(body));
        navigate('/')
      }else{
        setErrorMessege("User not found , Please first register yourself")
      }
      
      action.resetForm()
    }
  })
  
  // useEffect(() => {
  //   if (status === 'fulfilled' && !isLoading) {
  //     localStorage.setItem('user', JSON.stringify(data?.user));
  //     const body = {
  //       email : data?.user?.email ,
  //       userName : data?.user?.userName ,
  //       isLoggedIn: true
  //     }
  //     dispatch(setUser(body));
  //     navigate('/')
  //   } else if (error) {
  //     setErrorMessege("User not found , Please first register yourself")
  //   }
  // }, [status])
  return (
    <>
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
            errorMessege?.length > 0 ?
              <>
                <FontAwesomeIcon icon={faCircleXmark} fade style={{ color: "#ef3038 ", fontSize: "60px" }} />
                <h4>{errorMessege}</h4>
              </> :
              null
          }
          <h1>Sign In</h1>
          <form method='post' onSubmit={handleSubmit} >
            <h5>E-mail</h5>
            <input
              type="text"
              name='email'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <span className="form-error" style={{ color: 'red' }}>{errors.email}</span>
            ) : null}
            <h5>Password</h5>
            <input
              value={values.password}
              type="password"
              name='password'
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <span className="form-error" style={{ color: 'red' }}>{errors.password}</span>
            ) : null}
            <button type="submit" className="login_signInButton"  >
              Sign-In
            </button>
          </form>
          <p>
            By Signing-in you agree to my Conditions of Service Agreement. For
            more info see our privacy Notice, our cookies Notice and gather data.
          </p>
          <button onClick={register} className="login_registerButton">
            <h5>
            Create your Account

            </h5>
          </button>
        </div>
      </div>
    </>
  )
}

export default Login

