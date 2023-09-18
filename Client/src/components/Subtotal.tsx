import '../styling/subtotal.css'
import CurrencyFormat from 'react-currency-format'
import { useNavigate } from 'react-router';
import { item } from '../typesInterface/interface';

type props = { isLoggedIn: boolean, products: Array<item> }
const SubTotal = ({ isLoggedIn, products }: props) => {

  const navigate = useNavigate()
  const getTotal = (product: Array<item>) => {
    let totalAmount = 0;
    if (product?.length !== 0) {
      product?.map((item: any) => {
        const price = Number(isLoggedIn ? item?.productID?.price : item?.price)
        totalAmount += price * item?.quantity
      })
    }
    return totalAmount
  }
  const handleCheckout = () => {
    if (products?.length !== 0) {
      navigate('/checkout')
    }
  }
  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => {
          return (
            <>
              <p>
                Subtotal({products?.length} items):  <strong> {value}</strong>
              </p>
              <small className="subtotal_gift">
                <input type="checkbox" />
                This Order Contains a gift
              </small>
            </>
          );
        }}
        decimalScale={2}
        value={getTotal(products)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"₹"}
      />
      <button onClick={handleCheckout}>
        <h5>
          Procced to CheckOut
        </h5>
      </button>
    </div>
  )
}

export default SubTotal