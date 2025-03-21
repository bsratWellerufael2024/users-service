import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(uname: string, pass: string): Promise<any> {
    const user = await this.userService.findByUserName(uname);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isValidPass = await bcrypt.compare(pass, user.password);
    if (!isValidPass) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id, uname: user.uname, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h', // Short-lived access token
    });

    return {
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        uname: user.uname,
        role: user.role,
      },
    };
  }
}
