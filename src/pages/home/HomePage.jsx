import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import ProductsGrid from "./ProductGrid";
import "./HomePage.css";

function HomePage({ cart, loadCart }) {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search');

  useEffect(() => {
    const getHomeData = async () => {
      const url = searchText ? `/api/products?search=${searchText}` : '/api/products';
      const response = await axios.get(url);
      setProducts(response.data);
    };
    getHomeData();
  }, [searchText]);


  return (
    <>
      <link rel="icon" type="image/svg+xml" href="favicon/home-favicon.png" />
      <title>Ecommerce Project</title>

      <Header cart={cart} />

      <div className="home-page">
        <ProductsGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}

export default HomePage;
