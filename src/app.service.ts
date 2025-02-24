import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class AppService {
  @EventPattern('ping')
  getHello(data:any): string {
    return `Pong:${data}`;
  }
}


