import { Types } from 'mongoose';
import { Subproduct } from 'src/schemas/subprod.schema';

export class CartDto {
  _id: string;
  user: Types.ObjectId;
  active: boolean;
  subproducts: Array<{ subproduct: Subproduct, quantity: number }>;
  total_price: number;
  total_products: number;
}
