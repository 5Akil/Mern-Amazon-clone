import { Link } from 'react-router-dom'
import '../../styling/chechoutHeader.css'

const CheckoutHeader = () => {
  return (
    <>
      <div className='checkoutHeader'>
        <Link to="/">
          <img className="logo" src="https://cdn.freebiesupply.com/images/large/2x/amazon-logo-transparent.png"/>
        </Link>
        <h4>Checkout</h4>

      </div>
    </>
  )
}

export default CheckoutHeader