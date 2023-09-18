import Header from './common/Header'
import Footer from './common/Footer'
import '../styling/home.css'
import Product from './Product';
import { useGetAllProductsQuery } from '../services/productService';

const Home = () => {

  const { data, isLoading } = useGetAllProductsQuery('');
  

   return (
    <>
      {
        !isLoading ?
          <div>
            <Header />
            <div className="home">
              <img
                className="home_image"
                src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg"
                alt=""
              />
            </div>
            <div className="home_wrapper">
              {
                data?.map((item: { productID: number; image: string; description: string; price: number; title: string; }) => {
                  const { productID, image, description, price, title } = item
                  return <>
                    <Product
                      key={productID}
                      id={productID}
                      image={image}
                      description={description}
                      price={price}
                      title={title}
                      quantity={1}
                    />
                  </>
                })
              }
            
            </div>

            <Footer/>
          </div> :
          null
      }
    </>
  )
}

export default Home