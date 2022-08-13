import type { ChatroomEntity } from '../chatroom.entity';

export type ChatroomResultType = Pick<
  ChatroomEntity,
  | 'id'
  | 'title'
  | 'description'
  | 'author'
  | 'author_profile_image'
  | 'latitude'
  | 'longitude'
>;

export type ChatroomResultByRangeType = ChatroomResultType & {
  distance: number;
};
