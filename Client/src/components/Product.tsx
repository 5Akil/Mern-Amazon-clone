import { useState } from "react";
import "../styling/product.css";
import { Link } from "react-router-dom";
import { useAddProductMutation } from "../services/cartService";
import { useAppDispatch, useAppSelector } from "../Store/Slices/hooks";
import { add } from "../Store/Slices/cartSlice";
import { Modal } from "react-bootstrap";

export interface Props {
  id: number,
  title: string,
  price: number,
  image: string,
  description: string,
  quantity: number

}
const Product = ({ id, title, price, image, description, quantity }: Props) => {

  const user = useAppSelector((state) => state.user)

  const dispatch = useAppDispatch();
  const [goto, setGoto] = useState(false)
  const [modalShow, setModalShow] = useState(false);
  const [addProduct] = useAddProductMutation()
  const addToCart = async () => {
    const body = {
      id, quantity
    }
    if (user.isLoggedIn) {
      await addProduct(body);
    } else {
      dispatch(
        add({ id, title, price, image, description, quantity })
      )
    }
    setGoto(true)
  }

  const handleClose = () => setModalShow(false);
  return (
    <>
      <div className="product" key={id}>
        <div className="product_info" >
          <p>{title}</p>
          <p className="product_price">
            <small>₹</small>
            <strong>{price}</strong>
          </p>
        </div>
        <div >
          <img className="product_img" onClick={() => setModalShow(true)} src={image} alt="" />
        </div>
      </div>
      <Modal show={modalShow} onHide={handleClose} size="lg" centered>
        <Modal.Header  style={{ borderBottom: 'none' }} closeButton/>
        <Modal.Body style={{paddingBottom:'30px'}} >
          <div >
            <div className="d-flex">
              <div className="modal_image">
                <div className="img">
                  <img src={image} alt="" />
                </div>
              </div>
              <div className="product_description d-flex  flex-column">
                <p className="title">{title}</p>
                <p className="description">{description}</p>
                <p className="product_price">
                  <small>₹</small>
                  <strong>{price}</strong>
                </p>
                <div>
                  {
                    goto ? (
                      <Link className="link" to='/cart'>
                        <button className="button"  >
                          Go to Cart
                        </button>
                      </Link>
                    ) : (
                      <button onClick={() => addToCart()} className="button" >Add to Cart</button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>


  );
}

export default Product;