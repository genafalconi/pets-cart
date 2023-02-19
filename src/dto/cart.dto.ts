import { SubproductDto } from "./subproduct.dto"

export class CartDto {
  user: string
  products: [SubproductDto]
  totalPrice: number
  totalProducts: number
  created_at: string
  updated_at: string
}
