import { Controller, Post, Body, Version, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiMessage, ApiStatus } from 'src/core/decorators';
import { INVALID_CREDENTIALS, USER_CREATED, USER_LOGGED_IN, V1 } from 'src/shared/utils/constants';
import { LOGIN, SIGNUP } from 'src/shared/utils/apiConstants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiMessage(USER_CREATED)
  @Version(V1)
  @Post(SIGNUP)
  signup(@Body() createAuthDto: CreateAuthDto) {
    try {
      return this.authService.create(createAuthDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiMessage(USER_LOGGED_IN)
  @ApiStatus(200)
  @Version(V1)
  @Post(LOGIN)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    try {
      const user = await this.authService.validateUser(loginAuthDto);
      console.log(user);
      if (user === null) {
        throw new UnauthorizedException(INVALID_CREDENTIALS);
      }
      return this.authService.login(user);
    } catch (error) {
      throw error;
    }
  }
}
