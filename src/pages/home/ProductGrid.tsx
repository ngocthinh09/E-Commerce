import ProductComponent from "./Product";
import type { Product } from "../../types";

interface ProductGridProps {
  products: Product[];
  loadCart: () => Promise<void>;
}

function ProductGrid({ products, loadCart }: ProductGridProps) {
  return (
    <div className="products-grid">
      {products.map((product) => {
        return (
          <ProductComponent key={product.id} product={product} loadCart={loadCart} />
        );
      })}
    </div>
  );
}

export default ProductGrid;
