import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CartDto } from 'src/dto/cart.dto';
import { SubproductDto } from 'src/dto/subproduct.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService
  ) { }

  @Post('/add/:idUser')
  async addToCart(@Body() subProductDto: SubproductDto, @Param('idUser') idUser: string): Promise<any> {
    return await this.cartService.addToCart(subProductDto, idUser)
  }

  @Get('/:idUser')
  async getUserCart(@Param('idUser') id: string) {
    return await this.cartService.getUserCart(id)
  }

  @Post('/create/:idUser')
  async saveLocalCart(@Body() cart: CartDto, @Param('idUser') idUser: string): Promise<any> {
    return await this.cartService.addLocalCart(cart, idUser)
  }
}
