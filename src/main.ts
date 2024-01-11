import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(4000);
}
bootstrap();


// {
//   "status": true,
//   "message": "Authorization URL created",
//   "data": {
//     "authorization_url": "https://checkout.paystack.com/aed0421cngqhuhk",
//     "access_code": "aed0421cngqhuhk",
//     "reference": "i79ozupgi6"
//   }
// }
// }