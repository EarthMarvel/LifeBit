import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create_board.dto';
import { UpdateBoardDto } from './dto/update_board.dto';
// import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Boards)
    private boardRepository: Repository<Boards>,
  ) {}

  // 게시물 전체 조회
  async getAllBoards() {
    return await this.boardRepository.find();
  }

  // 게시물 단건 조회
  async findOneBoards(boardId: number): Promise<Boards> {
    const board = await this.boardRepository.findOne({
      where: { boardId: boardId },
    });
    if (!board) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    return board;
  }

  // 게시물 생성
  async createBoard(createBoardDto: CreateBoardDto): Promise<Boards> {
    const newBoard = this.boardRepository.create({
      ...createBoardDto,
    });

    await this.boardRepository.save(newBoard);
    return newBoard;
  }

  // 게시물 수정
  async updateBoard(
    boardId: number,
    updateBoardDto: UpdateBoardDto,
  ): Promise<void> {
    await this.findOneBoards(boardId);
    await this.boardRepository.update({ boardId }, updateBoardDto);
  }

  // 게시물 삭제
  async deleteBoard(boardId: number): Promise<void> {
    await this.findOneBoards(boardId);
    await this.boardRepository.delete(boardId);
  }

  // 게시물 좋아요
  async likeBoard(boardId: number): Promise<void> {
    const board = await this.boardRepository.findOne({
      where: { boardId: boardId },
    });

    if (!board) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }

    // // 이미 좋아요 한 유저인지 확인
    // const alreadyLiked = board.like.some((user) => user.user_id === userId);

    // if (alreadyLiked) {
    //   throw new BadRequestException('이미 좋아요를 누른 사용자입니다');
    // }

    // // 게시물에 좋아요 추가
    // const user = new User();
    // user.user_id = userId;
    // board.like.push(user);

    // 좋아요 수 증가
    board.likedCount++;

    await this.boardRepository.save(board);
  }

  //   // 게시물 좋아요 취소
  //   async unlikeBoard(boardId: number, userId: number) {
  //     const board = await this.boardRepository.findOne({
  //       where: { boardId: boardId },
  //     });

  //     if (!board) {
  //       throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
  //     }

  //     // 유저의 좋아요 찾고 삭제
  //     board.like = board.like.filter((user) => user.user_id !== userId);

  //     // 좋아요 수 감소
  //     board.likedCount--;

  //     await this.boardRepository.save(board);
  //   }
}
