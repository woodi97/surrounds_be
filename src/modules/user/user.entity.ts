import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BoardEntity } from '../boards/board.entity';
import { ChatroomEntity } from '../chatroom/chatroom.entity';
import { UserVendorStatusEnum } from './user-vendor-status.enum';

@Entity('user')
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserVendorStatusEnum,
    default: UserVendorStatusEnum.LOCAL,
  })
  auth_vendor: UserVendorStatusEnum;

  @Column()
  profile_image: string;

  @OneToMany(() => BoardEntity, (board) => board.user, { eager: true })
  boards: BoardEntity[];

  @OneToOne(() => ChatroomEntity, {
    nullable: true,
    eager: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'chatroom_id' })
  chatroom: ChatroomEntity | null;
}
