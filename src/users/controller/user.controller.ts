import {
  Controller,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';

import {
  EventPattern,
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { UpdateUserDto } from '../dto/UpdateUserDto.dto';

import { UnauthorizedException } from '@nestjs/common';

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
  async signIn(
    @Payload() payload: Record<string, any>,
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log(`Login attempt: ${payload.uname}`);
      if (!payload.uname || !payload.password) {
        return {
          success: false,
          message: 'Username and password are required',
        };
      }

      const result = await this.authService.signIn(
        payload.uname,
        payload.password,
      );

      console.log(`✅ User logged in: ${payload.uname}`);
      return result; 
    } catch (error) {
      console.error(`Login failed for ${payload.uname}:`, error.message);

      if (error instanceof UnauthorizedException) {
        return { success: false, message: 'Invalid username or password' };
      }

      return { success: false, message: 'Internal server error' };
    }
  }

  @MessagePattern('get-all-users')
  async getAllUsers(@Payload() data: any) {
    if (data.success === false) {
      return data;
    }
    return this.userService.findAll();
  }

  @MessagePattern('get-one-user')
  findById(id:any): any {
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
