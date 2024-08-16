import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ID, PID, USERS } from 'src/shared/utils/apiConstants';
import { V1 } from 'src/shared/utils/constants';
import { AuthGuard } from 'src/core/guards/auth.guard';

@Controller(USERS)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Version(V1)
  @Get()
  findAll(@Request() req) {
    try {
      console.log(req.user);
      return this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Version(V1)
  @Get(PID)
  findOne(@Param(ID) id: string) {
    try {
      return this.usersService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Version(V1)
  @Patch(PID)
  update(@Param(ID) id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Version(V1)
  @Delete(PID)
  remove(@Param(ID) id: string) {
    try {
      return this.usersService.remove(id);
    } catch (error) {
      throw error;
    }
  }
}
