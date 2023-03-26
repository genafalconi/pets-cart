import { DocumentData } from 'firebase-admin/firestore';
import { CartDto } from 'src/dto/cart.dto';
import { SubproductDto } from 'src/dto/subproduct.dto';

export function fillCartEntity(
  subProduct: SubproductDto,
  idUser: string,
): DocumentData {
  const cartToSave = new CartDto();
  cartToSave.user = idUser;
  cartToSave.isActive = true;
  cartToSave.products = [subProduct];
  cartToSave.totalProducts = cartToSave.products.length;
  cartToSave.totalPrice = subProduct.price * subProduct.quantity;
  cartToSave.created_at = new Date().toISOString();
  cartToSave.updated_at = '';

  const plainObj = Object.assign({}, cartToSave);

  return plainObj;
}
