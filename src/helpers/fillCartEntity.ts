import { Document, Model, Types } from 'mongoose';
import { SubproductDto } from 'src/dto/subproduct.dto';
import { Cart } from 'src/schemas/cart.schema';
import { Subproduct } from 'src/schemas/subprod.schema';

export function fillCartEntity(
  subProduct: SubproductDto,
  idUser: string,
  subproductSchema: Subproduct,
  cartModel: Model<Cart>
): Document {
  const cartToSave = new cartModel({
    user: new Types.ObjectId(idUser),
    active: true,
    subproducts: [{ subproduct: subproductSchema._id, quantity: subProduct.quantity }],
    total_products: subProduct.quantity,
    total_price: subProduct.sell_price * subProduct.quantity,
  });
  return cartToSave;
}
