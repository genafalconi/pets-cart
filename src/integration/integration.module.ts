import { Module } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';

@Module({
  controllers: [IntegrationController],
  providers: [IntegrationService, CartService],
})
export class IntegrationModule {}
