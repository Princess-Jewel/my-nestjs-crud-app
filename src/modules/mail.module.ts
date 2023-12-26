import { Module } from '@nestjs/common';
import { MailService } from 'src/services/mail.service';


@Module({
    providers:[
       MailService 
    ]

})
export class MailModule {}
