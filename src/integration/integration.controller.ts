import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DocumentData } from 'firebase-admin/firestore';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService
  ) { }

  @MessagePattern({ cmd: 'user-cart' })
  async getUserCart(idUser: string): Promise<DocumentData> {
    return await this.integrationService.getUserCart(idUser)
  }

  @MessagePattern({ cmd: 'order-cart' })
  async getOrderCart(cartId: string): Promise<DocumentData> {
    return await this.integrationService.getOrderCart(cartId)
  }

}
