import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';
// import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
// import { Roles } from '../decorators/roles.decorator';
// import { Roles } from '../shared/decorators/roles.decorator';
// import { Role } from '../enums/role.enum';
// import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '../common/dto/api-response.dto';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../guards/jwt-auth.guard';
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  // @UseGuards(AuthGuard)
  // @Roles(Role.User, Role.Admin)
  @MessagePattern('user-created')
  async createUser(data: any) {
    console.log('Received Event Data:', data); // Debug log
    return this.userService.createUser(data);
  }

  @MessagePattern('login')
  async signIn(@Body() payload: Record<string, any>) {
    console.log('user loged in');
    return await this.authService.singIN(payload.uname, payload.password);
  }

  @MessagePattern('get-all-users')
  @UseGuards(AuthGuard)
  async getAllUsers(@Payload() data: any) {
    if (data.success === false) {
      return data; // Return the error response from AuthGuard
    }
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<ApiResponse<any>> | null {
    return this.userService.findById(+id);
  }

  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard)
  @Delete(':id')
  removeUser(@Param('id') id: number): Promise<ApiResponse<any>> {
    return this.userService.removeUser(+id);
  }
}
