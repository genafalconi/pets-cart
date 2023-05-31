import { DocumentData } from 'firebase-admin/firestore';
import { CartDto } from 'src/dto/cart.dto';
import { SubproductDto } from 'src/dto/subproduct.dto';
import { Cart } from 'src/schemas/cart.schema';
import { Subproduct } from 'src/schemas/subprod.schema';

export function removeSubprodFromCart(
  subprod: SubproductDto,
  cart: Cart,
): Cart {
  console.log(subprod);
  const updatedSubprods = cart.subproducts.filter(
    (elem) => elem.subproduct._id.toString() !== subprod._id.toString(),
  );
  cart.subproducts = updatedSubprods;

  let newTotalP = 0,
    newCant = 0;
  cart.subproducts.forEach((elem) => {
    const subProdTotal = elem.subproduct.sell_price * elem.quantity;
    newTotalP += subProdTotal;
    newCant += elem.quantity;
  });

  cart.total_price = newTotalP;
  cart.total_products = newCant;
  
  if (cart.total_products === 0) {
    cart.subproducts = []
  }
  
  return cart;
}
