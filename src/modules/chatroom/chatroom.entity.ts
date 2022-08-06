import { Point } from 'geojson';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../user/user.entity';

@Entity('chatroom')
export class ChatroomEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  author_profile_image: string;

  @Column({
    type: 'double precision',
    name: 'd_lat',
  })
  latitude: number;

  @Column({
    type: 'double precision',
    name: 'd_long',
  })
  longitude: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @OneToOne(() => UserEntity, (user) => user.chatroom, {
    createForeignKeyConstraints: false,
  })
  user: UserEntity;
}
