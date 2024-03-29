import { Product } from 'src/schemas/product.schema';
import {
  AnimalAgeDto,
  AnimalDto,
  AnimalSizeDto,
  BrandDto,
  CategoryDto,
} from './types.dto';

export class SubproductDto {
  _id: string;
  product: Product;
  buy_price: number;
  sell_price: number;
  size: number;
  category: CategoryDto;
  animal: AnimalDto;
  brand: BrandDto;
  animal_size: AnimalSizeDto;
  animal_age: AnimalAgeDto;
  active: boolean;
  stock: number;
  quantity: number;
  sale_price: number;
}
