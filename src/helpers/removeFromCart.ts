import { DocumentData } from 'firebase-admin/firestore';
import { CartDto } from 'src/dto/cart.dto';
import { SubproductDto } from 'src/dto/subproduct.dto';

export function removeSubprodFromCart(
  subprod: SubproductDto,
  cart: DocumentData,
): DocumentData {
  const updatedProds = cart.products.filter(
    (elem: SubproductDto) => elem.id !== subprod.id,
  );
  cart.products = updatedProds;

  let newTotalP = 0,
    newCant = 0;
  cart.products.map((elem: SubproductDto) => {
    const subProdTotal = elem.quantity * elem.price;
    newTotalP += subProdTotal;
    newCant += elem.quantity;
  });

  cart.totalPrice = newTotalP;
  cart.totalProducts = newCant;
  cart.updated_at = new Date().toISOString();

  return cart;
}
