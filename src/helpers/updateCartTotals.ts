import { Cart } from 'src/schemas/cart.schema';

export function updateCartTotals(updatedCart: Cart) {
  let newTotalP = 0,
    newCant = 0;
  updatedCart.subproducts.map((elem) => {
    const subProdTotal = elem.quantity * elem.subproduct.sell_price;
    newTotalP += subProdTotal;
    newCant += elem.quantity;
    elem.profit =
      (elem.subproduct.sell_price - elem.subproduct.buy_price) * elem.quantity;
  });

  updatedCart.total_price = newTotalP;
  updatedCart.total_products = newCant;

  if (updatedCart.total_products === 0) {
    updatedCart.subproducts = [];
  }

  return updatedCart;
}
