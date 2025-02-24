import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiResponse } from '../common/dto/api-response.dto';
import { Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ApiResponse<any>> {
    try {
      const users = await this.userRepository.find();
      return new ApiResponse(true, 'All Users fetched successfuly', users);
    } catch (error) {
      throw new HttpException(
        new ApiResponse(false, 'Error While Feching Users', undefined, {
          code: 500,
          detail: 'internal sever error',
        }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async createUser(userData: {
    fname: string;
    lname: string;
    uname: string;
    password: string;
    role: string;
  }):
  Promise<ApiResponse<any>>
   {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = this.userRepository.create({
        fname: userData.fname,
        lname: userData.lname,
        uname: userData.uname,
        password: hashedPassword,
        role: userData.role,
      });

      await this.userRepository.save(newUser);

      console.log('User Created:', newUser);
      return new ApiResponse(true, 'User Created Successfully');
    } catch (error) {
      throw new Error(`User creation failed: ${error.message}`);
    }
  }
  async findById(id: number): Promise<ApiResponse<any>> {
    try {
      const user = await this.findById(id);
      return new ApiResponse(true, 'User Successfuly Fetched', user);
    } catch (error) {
      throw new HttpException(
        new ApiResponse(false, 'User Not Found', undefined, {
          code: 500,
          detail: error.message,
        }),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUser(id: number): Promise<ApiResponse<any>> {
    try {
      const result = this.userRepository.delete({ id });
      if ((await result).affected === 0) {
        throw new NotFoundException(`User With Id ${id} Not Found`);
      }
      return new ApiResponse(true, `User With Id ${id} Deleted Successfuly `);
    } catch (error) {
      throw new HttpException(
        new ApiResponse(false, "Error Can't Delete", undefined, {
          code: 404,
          detail: error.message,
        }),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findByUserName(uname: string): Promise<User> | null {
    return this.userRepository.findOneBy({uname});
  }
}
