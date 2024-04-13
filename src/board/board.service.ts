import {
  BadRequestException,
  // BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Boards } from './entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create_board.dto';
import { UpdateBoardDto } from './dto/update_board.dto';
import { SearchBoardDto } from './dto/serach_board.dto';
import { User } from 'src/user/entities/user.entity';
import { SocketGateway } from './socket/socket.gateway';
import { S3Service } from 'src/user/s3.service';
import { extname } from 'path';
import _ from 'lodash';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Boards)
    private readonly boardRepository: Repository<Boards>,
    private readonly socketGateway: SocketGateway,
    private readonly s3Service: S3Service,
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
  async createBoard(createBoardDto: CreateBoardDto, file: Express.Multer.File) {
    if (_.isNil(file)) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    const fileExt = extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      throw new BadRequestException('올바른 JPEG, PNG, GIF 파일이 아닙니다.');
    }

    await this.boardRepository.save({
      ...createBoardDto,
      thumbnail: file.filename,
    });
    console.log(file);
    await this.s3Service.putObject(file);
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
  async likeBoard(boardId: number, userId: number): Promise<void> {
    const board = await this.boardRepository.findOne({
      where: { boardId: boardId },
    });

    if (!board) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }

    // const alreadyLiked =
    //   board && board.like && board.like.some((user) => user.user_id === userId);

    // if (alreadyLiked) {
    //   throw new BadRequestException('이미 좋아요를 누른 사용자입니다');
    // }

    if (!board.like) {
      board.like = [];
    }

    // 게시물에 좋아요 추가
    const user = new User();
    user.user_id = userId;
    board.like.push(user);

    // 좋아요 수 증가
    board.likedCount++;

    await this.boardRepository.save(board);

    // 좋아요 알림 발송
    this.socketGateway.LikeNotification(boardId, userId);
  }

  // 게시물 좋아요 취소
  async unlikeBoard(boardId: number, userId: number) {
    const board = await this.boardRepository.findOne({
      where: { boardId: boardId },
    });

    if (!board) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }

    // 유저의 좋아요 찾고 삭제
    board.like =
      board &&
      board.like &&
      board.like.filter((user) => user.user_id !== userId);

    // 좋아요 수 감소
    board.likedCount--;

    await this.boardRepository.save(board);
  }

  // 게시물 검색
  async searchBoards(searchBoardDto: SearchBoardDto): Promise<Boards[]> {
    const { title, category } = searchBoardDto;
    const query = this.boardRepository.createQueryBuilder('boards');

    if (title) {
      query.where('boards.title LIKE :title', { title: `%${title}%` });
    }

    if (category) {
      query.andWhere('boards.category = :category', { category });
    }

    return await query.getMany();
  }
}
