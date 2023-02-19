import { SubproductDto } from "./subproduct.dto"

export class ProductDto {
  name: string
  subProducts: [SubproductDto]
  category: string
  isActive: boolean
  isHighlight: boolean
  description: string
  image: string
  created_at: string
  updated_at: string
}