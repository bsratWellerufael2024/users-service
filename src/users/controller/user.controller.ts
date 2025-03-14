import {
  Controller,

  Param,

  Body,

  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';

import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { UpdateUserDto } from '../dto/UpdateUserDto.dto';


@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @MessagePattern('user-created')
  async createUser(@Body() data: any) {
    console.log('Received Event Data:', data);
    return this.userService.createUser(data);
  }

  @MessagePattern('login')
  async signIn(@Body() payload: Record<string, any>) {
    console.log('user loged in', payload);
    return await this.authService.singIN(payload.uname, payload.password);
  }

  @MessagePattern('get-all-users')
  async getAllUsers(@Payload() data: any) {
    if (data.success === false) {
      return data;
    }
    return this.userService.findAll();
  }

  @MessagePattern('get-one-user')
  findById(id: any): any {
    return this.userService.findById(id);
  }

  @MessagePattern('deleteUser')
  async deleteUserMessage(data: { userId: number }): Promise<any> {
    const { userId } = data;
    await this.userService.deleteUser(userId);
    return { message: 'User successfully deleted' };
  }

  @MessagePattern('updateUser')
  async updateUserMessage(data: {
    userId: number;
    updateUserDto: UpdateUserDto;
  }): Promise<any> {
    const { userId, updateUserDto } = data;
    return this.userService.updateUser(userId, updateUserDto);
  }
  
}
