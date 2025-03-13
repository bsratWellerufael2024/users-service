import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
