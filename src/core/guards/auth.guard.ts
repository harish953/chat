/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from '../exceptions/application.exception';
import { UsersRepository } from 'src/modules/users/users.repository';
import { INVALID_TOKEN, USER_NOT_FOUND } from 'src/shared/utils/constants';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private userRepository: UsersRepository) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      const validatedUser = await this.fetchUserFromToken(user.id);
      request.user = validatedUser;
      return true;
    }

    throw new UnauthorizedException(INVALID_TOKEN);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException(INVALID_TOKEN);
    }
    return user;
  }

  private async fetchUserFromToken(userId: string) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UnauthorizedException(USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(INVALID_TOKEN);
    }
  }
}
