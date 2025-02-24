import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { UsersService } from './users/services/user.service';
@Controller()

export class AppController {
  @EventPattern('user_created') 
  handleUserCreated(data: any) {
       console.log(`Received User Data ${JSON.stringify(data)}`);
   }
}
