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
//     "authorization_url": "https://checkout.paystack.com/3xcxfnwm3v13obb",
//     "access_code": "3xcxfnwm3v13obb",
//     "reference": "zb5qukka59"
//   }
// }