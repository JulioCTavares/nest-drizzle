import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [DrizzleModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
