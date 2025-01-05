import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';
import refreshJwtConfig from './config/refresh-jwt.config';
import { RegisterDto } from './dto/register.dto';
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

  login(userId: string) {
    const payload: JwtPayload = {
      sub: userId,
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
}
