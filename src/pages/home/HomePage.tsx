import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import ProductGrid from "./ProductGrid";
import "./HomePage.css";
import type { Product, CartItem } from "../../types";

interface HomePageProps {
  cart: CartItem[];
  loadCart: () => Promise<void>;
}

function HomePage({ cart, loadCart }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search');

  useEffect(() => {
    const getHomeData = async () => {
      const url = searchText ? `/api/products?search=${searchText}` : '/api/products';
      const response = await axios.get<Product[]>(url);
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
        <ProductGrid products={products} loadCart={loadCart} />
      </div>
    </>
  );
}

export default HomePage;
