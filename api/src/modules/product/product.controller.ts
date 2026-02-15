import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query('search') search: string) {
    if (search) {
      let products = await this.productService.findAll();
      const lowerCaseSearch = search.toLowerCase();

      products = products.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(lowerCaseSearch);
        const keywordMatch = product.keywords.some((keyword) => {
          return keyword.toLowerCase().includes(lowerCaseSearch);
        });
        return nameMatch || keywordMatch;
      });

      return products;
    } else {
      return this.productService.findAll();
    }
  }
}
