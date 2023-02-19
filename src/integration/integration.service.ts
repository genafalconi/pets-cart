import { Inject, Injectable } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class IntegrationService {

  constructor(
    @Inject(CartService)
    private readonly cartService: CartService
  ) { }

  async getUserCart(idUser: string) {
    return await this.cartService.getUserCart(idUser)
  }

}
