import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DocumentData } from 'firebase-admin/firestore';
import { QuantityUpdateDto } from 'src/dto/quantityUpdate.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase.auth.guard';
import { CartDto } from '../dto/cart.dto';
import { SubproductDto } from '../dto/subproduct.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(
    @Inject(CartService)
    private readonly cartService: CartService,
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('/add/:idUser')
  async addToCart(
    @Body() subProductDto: SubproductDto,
    @Param('idUser') idUser: string,
  ): Promise<DocumentData> {
    return await this.cartService.addToCart(subProductDto, idUser);
  }

  @UseGuards(FirebaseAuthGuard)
  @Delete('/remove/:idUser')
  async removeFromCart(
    @Body() subProductDto: SubproductDto,
    @Param('idUser') idUser: string,
  ): Promise<DocumentData> {
    return await this.cartService.removeFromCart(subProductDto, idUser);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/:idUser')
  async getUserCart(@Param('idUser') id: string): Promise<DocumentData> {
    return await this.cartService.getUserCart(id);
  }

  @Post('/create/:idUser')
  async saveLocalCart(
    @Body() cart: CartDto,
    @Param('idUser') idUser: string,
  ): Promise<DocumentData> {
    return await this.cartService.addLocalCart(cart, idUser);
  }

  @UseGuards(FirebaseAuthGuard)
  @Put('/update/quantity/:idUser')
  async updateSubprodQuantity(
    @Body() subprodQuantity: QuantityUpdateDto,
    @Param('idUser') idUser: string,
  ): Promise<DocumentData> {
    return await this.cartService.updateSubprodQuantity(
      subprodQuantity,
      idUser,
    );
  }
}
