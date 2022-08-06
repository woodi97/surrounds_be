import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/user.repository';
import { ChatroomController } from './chatroom.controller';
import { ChatroomRepository } from './chatroom.repository';
import { ChatroomService } from './chatroom.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatroomRepository, UserRepository]),
    AuthModule,
  ],
  providers: [ChatroomService],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
