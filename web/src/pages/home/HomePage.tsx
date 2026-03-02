import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Header from "../../components/Header";
import ProductGrid from "./ProductGrid";
import "./HomePage.css";
import type { Product } from "../../types";
import { productService } from "../../services/ProductService";


function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search');

  useEffect(() => {
    const getHomeData = async () => {
      const response = await productService.getProduct(searchText);
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
