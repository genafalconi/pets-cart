import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationService
  ) { }

  @MessagePattern({ cmd: 'user-cart' })
  async createProd(idUser: string): Promise<any> {
    return await this.integrationService.getUserCart(idUser)
  }

}
