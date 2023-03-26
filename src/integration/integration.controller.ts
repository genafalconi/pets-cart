import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentData } from 'firebase-admin/firestore';
import { FirebaseAuthGuard } from 'src/firebase/firebase.auth.guard';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {

  constructor(
    private readonly integrationService: IntegrationService
  ) { }

  @UseGuards(FirebaseAuthGuard)
  @Get('/user_cart')
  async getUserCart(@Param('idUser') idUser: string): Promise<DocumentData> {
    return await this.integrationService.getUserCart(idUser);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/order_cart')
  async getOrderCart(cartId: string): Promise<DocumentData> {
    return await this.integrationService.getOrderCart(cartId);
  }
}
