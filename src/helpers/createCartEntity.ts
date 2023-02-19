import { CartDto } from "src/dto/cart.dto";

export function createCartEntity(cartData: CartDto, idUser: string) {
  cartData.user = idUser
  const plainObj = Object.assign({}, cartData);

  return plainObj;
}