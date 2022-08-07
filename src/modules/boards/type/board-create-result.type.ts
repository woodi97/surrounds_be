import type { BoardEntity } from '../board.entity';
import type { BoardStatus } from '../board-status.enum';

export class BoardCreateResultType
  implements Pick<BoardEntity, 'id' | 'title' | 'description' | 'status'>
{
  id: string;

  title: string;

  description: string;

  status: BoardStatus;
}
