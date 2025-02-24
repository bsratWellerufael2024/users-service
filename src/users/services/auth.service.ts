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
  async singIN(uname: string, pass: string): Promise<any> {
    const user = await this.userService.findByUserName(uname);

    if (!user) {
       console.log(user);
      throw new UnauthorizedException('no user registered using this username');
    }
    const ValidPass = await bcrypt.compare(pass, user.password);
    if (!ValidPass) {
      throw new UnauthorizedException('invalid password');
    }
    const payload = { sub: user.id, uname: user.uname, role: user.role };
    return {
      access_Token: await this.jwtService.signAsync(payload),
    };
  }
}
