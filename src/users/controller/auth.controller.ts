import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
// import { AuthService } from './auth.service';
import { AuthService } from '../services/auth.service';
// import { CreateUserDTO } from '../dto/create-user.dto';
import { EventPattern } from '@nestjs/microservices';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
