import { Cart } from 'src/schemas/cart.schema';
import { Subproduct } from 'src/schemas/subprod.schema';

export function updateCartProducts(
  userCart: Cart,
  oldCartSubprod: Array<{ subproduct: Subproduct; quantity: number }>,
  newProd: Subproduct,
  newQuantity: number,
) {
  let newTotalP = 0,
    newCant = 0;

  const existProd = oldCartSubprod.find((elem: any) => {
    return elem.subproduct._id.toString() === newProd._id.toString();
  });

  if (existProd) {
    existProd.quantity += newQuantity;
    oldCartSubprod.map((elem: any) => {
      const subProdTotal = elem.quantity * elem.subproduct.sell_price;
      newTotalP += subProdTotal;
      newCant += elem.quantity;
    });
  } else {
    const newSubProd: { subproduct: Subproduct; quantity: number } = {
      subproduct: newProd,
      quantity: newQuantity,
    };
    oldCartSubprod.push(newSubProd);
    oldCartSubprod.map((elem: any) => {
      const subProdTotal = elem.quantity * elem.subproduct.sell_price;
      newTotalP += subProdTotal;
      newCant += elem.quantity;
    });
  }
  userCart.total_price = newTotalP;
  userCart.total_products = newCant;

  if (userCart.total_products === 0) {
    userCart.subproducts = [];
  }

  return userCart;
}
