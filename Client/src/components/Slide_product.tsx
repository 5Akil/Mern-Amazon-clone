import "../styling/slideproduct.css";
import { add } from "../Store/Slices/cartSlice";
import { Props } from "./Product";
import { useAppDispatch } from "../Store/Slices/hooks";

const Slide_Product=({ id, image, title, price ,description , quantity}:Props)=> {

  const dispatch= useAppDispatch();
  const addToCart =()=>{
    dispatch(
      add({ id, title, price , image , description ,quantity})
    );
  }

  return (
    <div className="card"  key={id} >
      <img className="product_image" src={image} alt="product image" />
      <div className="product__info">
        <h2>{title}</h2>
        <p className="price">₹{price}</p>
      </div>
      <button onClick={addToCart} >Add to Cart</button>
    </div>
  );
}

export default Slide_Product;

export const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4,
      slidesToSlide: 1 ,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };