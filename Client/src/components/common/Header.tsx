import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useNavigate } from 'react-router-dom'
import { faMagnifyingGlass, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import '../../styling/header.css'
import { useAppDispatch, useAppSelector } from '../../Store/Slices/hooks'
import { useGetCountQuery } from '../../services/cartService'
import { setUser } from '../../Store/Slices/userAuth'
import { removeItems } from '../../Store/Slices/checkOutSlice'

const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [fetch, setFetch] = useState(false)
  console.log(fetch);
  
  const { email, isLoggedIn } = useAppSelector((state) => state.user)
  const { basket } = useAppSelector((state) => state.basket)
  const { data } = useGetCountQuery(isLoggedIn, { skip: !fetch })
  
  const signOut = () => {
    dispatch(setUser(null))
    dispatch(removeItems())
    localStorage.removeItem('user')
    navigate('/')
  };

  useEffect(() => {
    if (isLoggedIn) {
      setFetch(true)
    }  
  }, [isLoggedIn])  


  return (
    <nav className="header">
      {/* amazon logo  */}
      <Link to="/">
        <img
          className="header_logo"
          src="https://pngimg.com/uploads/amazon/amazon_PNG11.png"
        />
      </Link>
      {/* header search bar */}
      <div className="header_search">
        <input type="text" className="header_searchInput" />
        <FontAwesomeIcon className="header_searchIcon" icon={faMagnifyingGlass} />
      </div>
      {/* header links  */}
      <div className="header_nave">
        <Link to={isLoggedIn ? "/" : "/login"} className="header_link">
          <div onClick={signOut} className="header_option">
            <span className="header_optionLineOne">Hello,{email} </span>
            <span className="header_optionLinetwo">{isLoggedIn ? 'sign Out' : 'Sign In'}</span>
          </div>
        </Link>
        <Link to="/" className="header_link">
          <div className="header_option">
            <span className="header_optionLineOne">return</span>
            <span className="header_optionLinetwo">& order</span>
          </div>
        </Link>
        <div className="header_option">
          <span className="header_optionLineOne"> Your</span>
          <span className="header_optionLinetwo">Prime</span>
        </div>
        <Link to="/cart" className="header_link">
          <div className="header_optionBasket">
            <FontAwesomeIcon icon={faCartShopping} />
            <span className="header_optionLinetwo header_basketCount">{isLoggedIn ? data?.count : basket?.length }</span>
          </div>
        </Link>
      </div>
    </nav>
  )
}

export default Header