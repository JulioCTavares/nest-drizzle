import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { users } from 'src/drizzle/schemas';
import { DrizzleDB } from 'src/drizzle/types/drizzle';

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findByEmail(email: string) {
    const user = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user.length > 0) {
      return user[0];
    }

    return null;
  }

  async create(data: RegisterDto) {
    const emailAlreadyExists = await this.findByEmail(data.email);

    if (emailAlreadyExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await hash(data.password, 10);

    await this.db.insert(users).values({ ...data, password: hashedPassword });

    return;
  }

  async findById(id: string) {
    const user = await this.db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        deleted: users.deleted,
      })
      .from(users)
      .where(eq(users.id, id));

    if (user.length > 0) {
      return user[0];
    }

    return null;
  }
}
