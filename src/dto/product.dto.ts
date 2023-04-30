import { SubproductDto } from './subproduct.dto';
import { AnimalAgeDto, AnimalDto, BrandDto } from './types.dto';

export class ProductDto {
  _id: string;
  name: string;
  subProducts: [SubproductDto];
  category: string;
  animal: AnimalDto;
  brand: BrandDto;
  animal_age: AnimalAgeDto;
  description: string;
  highlight: boolean;
  image: string;
  active: boolean;
}
