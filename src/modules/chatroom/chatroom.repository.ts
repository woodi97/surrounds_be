import { ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Point } from 'geojson';
import { EntityRepository, Repository } from 'typeorm';

import type { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { ChatroomEntity } from './chatroom.entity';
import type { CreateChatroomDto } from './dto/create-chatroom.dto';
import type { GetChatroomDto } from './dto/get-chatroom.dto';
import type {
  ChatroomResultByRangeType,
  ChatroomResultType,
} from './type/chatroom-result.type';

@EntityRepository(ChatroomEntity)
export class ChatroomRepository extends Repository<ChatroomEntity> {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super();
  }

  async getMyChatroom(user: UserEntity): Promise<ChatroomResultType> {
    // Todo: check current user's location & if it is too far from current chatroom
    const chatroom = await this.findOne({
      relations: ['user'],
      where: {
        user: {
          id: user.id,
        },
      },
    });

    if (!chatroom) {
      throw new ForbiddenException('User does not has a chatroom');
    }

    return {
      id: chatroom.id,
      title: chatroom.title,
      description: chatroom.description,
      latitude: chatroom.latitude,
      longitude: chatroom.longitude,
      author: chatroom.author,
      author_profile_image: chatroom.author_profile_image,
    };
  }

  async getChatroomByRange(getChatroomDto: GetChatroomDto) {
    const { latitude, longitude, radius } = getChatroomDto;
    const origin: Point = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    // set default radius as 1km
    const range = radius ?? 1000;

    const locations: ChatroomResultByRangeType[] =
      await this.createQueryBuilder('chatroom')
        .select([
          'chatroom.id AS id',
          'chatroom.title AS title',
          'chatroom.description AS description',
          'chatroom.author AS author',
          'chatroom.author_profile_image AS author_profile_image',
          'chatroom.latitude AS latitude',
          'chatroom.longitude AS longitude',
          'ST_Distance(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)))/1000 AS distance',
        ])
        .where(
          'ST_DWithin(location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), ST_SRID(location)), :range)',
        )
        .orderBy('distance', 'ASC')
        .setParameters({
          origin: JSON.stringify(origin),
          range: range * 1000,
        })
        .getRawMany();

    return locations;
  }

  async createChatroom(
    createChatroomDto: CreateChatroomDto,
    user: UserEntity,
  ): Promise<ChatroomResultType> {
    // check if user is already has a chatroom
    const chatroom = await this.find({
      relations: ['user'],
      where: {
        user: {
          id: user.id,
        },
      },
    });

    // if user has a chatroom, throw error
    if (chatroom.length > 0) {
      throw new ForbiddenException('User is already has a chatroom');
    }

    const { latitude, longitude } = createChatroomDto;
    const location: Point = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const newChatroom: ChatroomEntity = this.create({
      ...createChatroomDto,
      author: user.username,
      author_profile_image: user.profile_image,
      location,
      user,
    });

    await this.save(newChatroom);

    return {
      id: newChatroom.id,
      title: newChatroom.title,
      description: newChatroom.description,
      author: newChatroom.author,
      author_profile_image: newChatroom.author_profile_image,
      latitude: newChatroom.latitude,
      longitude: newChatroom.longitude,
    };
  }

  async deleteChatroom(user: UserEntity): Promise<void> {
    if (!user.chatroom) {
      throw new ForbiddenException('User does not has a chatroom');
    }

    await this.delete(user.chatroom.id);

    // Todo: should we delete chatroom_id on user entity?
  }
}
