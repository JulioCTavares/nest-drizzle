import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, gte, ilike, lte } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { products as productSchema } from 'src/drizzle/schemas';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProducts } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Condition } from './types/condition';

@Injectable()
export class ProductsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.db
      .select({})
      .from(productSchema)
      .where(
        and(
          eq(productSchema.name, createProductDto.name),
          eq(productSchema.team, createProductDto.team ?? ''),
          eq(productSchema.year, createProductDto.year ?? 0),
        ),
      )
      .limit(1);

    if (existingProduct.length > 0) {
      throw new ConflictException('Product already exists');
    }

    const sanitizedName = createProductDto.name.trim().replace(/\s+/g, ' ');
    const sanitizedTeam = createProductDto.team?.trim().toLowerCase();

    const createdProduct = await this.db
      .insert(productSchema)
      .values({
        ...createProductDto,
        name: sanitizedName,
        team: sanitizedTeam,
        price: createProductDto.price.toString(),
      })
      .returning({
        id: productSchema.id,
        name: productSchema.name,
        team: productSchema.team,
        year: productSchema.year,
        price: productSchema.price,
      });

    return createdProduct[0];
  }

  async findAll(filters: FilterProducts) {
    const { team, minPrice, maxPrice, year, page = 1, limit = 10 } = filters;

    const conditions: Condition[] = [];

    if (team) conditions.push(ilike(productSchema.team, `%${team}%`));
    if (minPrice)
      conditions.push(gte(productSchema.price, minPrice.toString()));
    if (maxPrice)
      conditions.push(lte(productSchema.price, maxPrice.toString()));
    if (year) conditions.push(eq(productSchema.year, year ?? 0));

    conditions.push(eq(productSchema.deleted, false));

    const result = await this.db
      .select()
      .from(productSchema)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset((page - 1) * limit);

    return result;
  }

  async findOne(id: string) {
    const product = await this.db
      .select()
      .from(productSchema)
      .where(eq(productSchema.id, id))
      .limit(1);

    if (product.length === 0) {
      return null;
    }

    return product[0];
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const product = this.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = this.db
      .update(productSchema)
      .set({
        ...(updateProductDto.name && { name: updateProductDto.name }),
        ...(updateProductDto.description && {
          description: updateProductDto.description,
        }),
        ...(updateProductDto.price && {
          price: updateProductDto.price.toString(),
        }),
        ...(updateProductDto.stock && { stock: updateProductDto.stock }),
        ...(updateProductDto.team && { team: updateProductDto.team }),
        ...(updateProductDto.year && { year: updateProductDto.year }),
      })
      .where(eq(productSchema.id, id))
      .returning({
        id: productSchema.id,
        name: productSchema.name,
        team: productSchema.team,
        year: productSchema.year,
        price: productSchema.price,
      });

    return updatedProduct[0];
  }

  async softDelete(id: string) {
    await this.db
      .update(productSchema)
      .set({ deleted: true })
      .where(eq(productSchema.id, id));
  }

  async remove(id: string) {
    await this.db.delete(productSchema).where(eq(productSchema.id, id));
  }
}
