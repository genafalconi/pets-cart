import { DocumentData } from "firebase-admin/firestore";
import { SubproductDto } from "src/dto/subproduct.dto";

export function updateCartProducts(userCart: DocumentData, oldCartSubprod: Array<SubproductDto>, newProd: SubproductDto) {
  let newTotalP = 0, newCant = 0
  const existProd = oldCartSubprod.find((elem: SubproductDto) => { return elem.id === newProd.id })

  if (existProd) {
    existProd.quantity += newProd.quantity
    oldCartSubprod.map((elem: SubproductDto) => {
      let subProdTotal = elem.quantity * elem.price
      newTotalP += subProdTotal
      newCant += elem.quantity
    })
  } else {
    oldCartSubprod.push(newProd)
    oldCartSubprod.map((elem: SubproductDto) => {
      let subProdTotal = elem.quantity * elem.price
      newTotalP += subProdTotal
      newCant += elem.quantity
    })
  }
  userCart.totalPrice = newTotalP
  userCart.totalProducts = newCant
  userCart.updated_at = new Date().toISOString()

  return userCart
}