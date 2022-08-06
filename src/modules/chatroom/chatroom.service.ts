import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import type { UserEntity } from '../user/user.entity';
import { ChatroomRepository } from './chatroom.repository';
import type { CreateChatroomDto } from './dto/create-chatroom.dto';
import type { GetChatroomDto } from './dto/get-chatroom.dto';
import type { ChatroomResultType } from './type/chatroom-result.type';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(ChatroomRepository)
    private chatroomRepository: ChatroomRepository,
  ) {}

  async getMyChatroom(user: UserEntity): Promise<ChatroomResultType> {
    return this.chatroomRepository.getMyChatroom(user);
  }

  async getChatroomByRange(getChatroomDto: GetChatroomDto) {
    return this.chatroomRepository.getChatroomByRange(getChatroomDto);
  }

  async createChatroom(
    createChatroomDto: CreateChatroomDto,
    user: UserEntity,
  ): Promise<ChatroomResultType> {
    return this.chatroomRepository.createChatroom(createChatroomDto, user);
  }

  async deleteChatroom(user: UserEntity): Promise<void> {
    await this.chatroomRepository.deleteChatroom(user);
  }
}
