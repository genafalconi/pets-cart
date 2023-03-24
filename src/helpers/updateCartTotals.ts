import { DocumentData } from "firebase-admin/firestore"
import { SubproductDto } from "src/dto/subproduct.dto"

export function updateCartTotals(updatedCart: DocumentData) {
  let newTotalP = 0, newCant = 0
  updatedCart.products.map((elem: SubproductDto) => {
    let subProdTotal = elem.quantity * elem.price
    newTotalP += subProdTotal
    newCant += elem.quantity
  })
  updatedCart.totalPrice = newTotalP
  updatedCart.totalProducts = newCant
  updatedCart.updated_at = new Date().toISOString()

  return updatedCart
}