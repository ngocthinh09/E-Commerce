import ProductComponent from "./Product";
import type { Product } from "../../types";

interface ProductGridProps {
  products: Product[];
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="products-grid">
      {products.map((product) => {
        return (
          <ProductComponent key={product.id} product={product} />
        );
      })}
    </div>
  );
}

export default ProductGrid;
