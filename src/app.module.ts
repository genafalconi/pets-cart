import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/${process.env.NODE_ENV || 'dev'}.env`,
    }),
    CartModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
