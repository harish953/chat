import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-user.dto';
import { AuthRepository } from './auth.repository';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ApplicationException, NotFoundException } from 'src/core/exceptions/application.exception';
import { USER_EXISTS, USER_NOT_FOUND, USERNAME_EXISTS } from 'src/shared/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const user = await this.authRepository.findByEmail(createAuthDto.email);
    const usernameExists = await this.authRepository.findByUsername(createAuthDto.username);
    if (usernameExists) {
      throw new ApplicationException(USERNAME_EXISTS);
    }
    if (user) {
      throw new ApplicationException(USER_EXISTS);
    }
    return this.authRepository.create(createAuthDto);
  }

  async findByEmail(email: string) {
    return await this.authRepository.findByEmail(email);
  }

  async validateUser(loginAuthDto: LoginAuthDto) {
    const user = await this.authRepository.findByEmail(loginAuthDto.email);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const isPasswordMatching = await bcrypt.compare(loginAuthDto.password, user.password);
    if (user && isPasswordMatching) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user._id, sub: user._id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
