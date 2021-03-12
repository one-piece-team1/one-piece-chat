import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ChatModule } from './chats/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './config/orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ChatModule],
})
export class AppModule {}
