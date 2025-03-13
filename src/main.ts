import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);
  const app=await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport:Transport.REDIS,
    options:{
        host:'127.0.0.1',
        port:6379
    }
  })
  await app.listen().then(()=>{
    console.log('User service is running on port 3001');
  })

}
bootstrap();

