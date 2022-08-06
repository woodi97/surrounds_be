import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/get-user.decorator';
import { UserEntity } from '../user/user.entity';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { GetChatroomDto } from './dto/get-chatroom.dto';

@Controller('chatroom')
@ApiTags('chatroom')
@UseGuards(AuthGuard())
export class ChatroomController {
  constructor(private chatRoomService: ChatroomService) {}

  @Get('/my-room')
  @ApiOkResponse()
  getMyRooms(@GetUser() user: UserEntity) {
    return this.chatRoomService.getMyChatroom(user);
  }

  @Get('/near')
  @ApiOkResponse()
  @UsePipes(ValidationPipe)
  getRoomByRange(@Body() getChatroomDto: GetChatroomDto) {
    return this.chatRoomService.getChatroomByRange(getChatroomDto);
  }

  @Post()
  @ApiOkResponse()
  @UsePipes(ValidationPipe)
  createRoom(
    @Body() createChatroomDto: CreateChatroomDto,
    @GetUser() user: UserEntity,
  ) {
    return this.chatRoomService.createChatroom(createChatroomDto, user);
  }

  @Delete()
  @ApiOkResponse()
  deleteRoom(@GetUser() user: UserEntity) {
    return this.chatRoomService.deleteChatroom(user);
  }
}
