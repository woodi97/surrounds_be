import type { ChatroomEntity } from '../chatroom.entity';

export type ChatroomResultType = Pick<
  ChatroomEntity,
  | 'id'
  | 'name'
  | 'title'
  | 'author'
  | 'author_profile_image'
  | 'latitude'
  | 'longitude'
>;

export type ChatroomResultByRangeType = Pick<
  ChatroomEntity,
  'id' | 'name' | 'title' | 'author' | 'author_profile_image'
> & {
  distance: number;
};
