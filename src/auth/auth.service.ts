import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import refreshJwtConfig from './config/refresh-jwt.config';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './enum/roleEnum';
import { CurrentUser } from './types/currentUser';
import { JwtPayload } from './types/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credential!');

    const isPasswordMatched = await compare(password, user.password);

    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credential!');

    return { id: user.id };
  }

  async register(data: RegisterDto) {
    return this.userService.create(data);
  }

  async login(data: LoginDto) {
    const user = await this.userService.findByEmail(data.email);

    if (!user) throw new UnauthorizedException('Invalid credential!');

    const isPasswordMatched = await compare(data.password, user.password);

    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credential!');

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role as Role,
    };

    const token = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  refresh(userId: string) {
    const payload: JwtPayload = {
      sub: userId,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }

  async validateJWTUser(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) throw new UnauthorizedException('Invalid credential!');

    const currentUser: CurrentUser = { id: user.id, role: user.role as Role };

    return currentUser;
  }
}
