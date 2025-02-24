import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { JwtModule, JwtService, } from '@nestjs/jwt';
import { jwtContants } from './users/constants/constants';
@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as any,
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User],
        synchronize: true,
        logging: false,
        //migrations: ['src/migrations/*.ts'],
      }),
    }),
    JwtModule.register({
      global: true, // Ensure it's global
      secret: jwtContants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AppController,JwtService],
  providers: [AppService],
})
export class AppModule {}
