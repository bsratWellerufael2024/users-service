import { Module } from '@nestjs/common';
import { UsersController } from './controller/user.controller';
import { UsersService } from './services/user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './services/auth.service';
import { JwtService,JwtModule } from '@nestjs/jwt';
import { jwtContants } from './constants/constants';
import { JsonContains } from 'typeorm';
// import { AuthController } from './controller/auth.controller';
// import { AuthService } from './services/auth.service';
console.log(jwtContants.secret);
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        transport: Transport.REDIS,
        name: 'USER_SERVICE',
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10),
          db: parseInt(process.env.REDIS_DB, 10),
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
