import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import ProductGrid from "./ProductGrid";
import "./HomePage.css";
import type { Product } from "../../types";


function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search');

  useEffect(() => {
    const getHomeData = async () => {
      const url = (searchText && searchText.trim().length > 0) ? `/api/products?search=${searchText}` : '/api/products';
      const response = await axios.get<Product[]>(url);
      setProducts(response.data);
    };

    getHomeData();
  }, [searchText]);


  return (
    <>
      <link rel="icon" type="image/svg+xml" href="favicon/home-favicon.png" />
      <title>Ecommerce Project</title>

      <Header />

      <div className="home-page">
        <ProductGrid products={products} />
      </div>
    </>
  );
}

export default HomePage;
