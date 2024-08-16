import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from './dto/create-user.dto';
import { hashPassword } from 'src/shared/utils/hash.util';

export class AuthRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateAuthDto): Promise<User> {
    const user = new this.userModel({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });
    return await user.save();
  }
  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
  findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }
}
