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
import { SocketGateway } from './socket/socket.gateway';
import { S3Service } from 'src/user/s3.service';
import { extname } from 'path';
import _ from 'lodash';
import { Like } from './entities/likes.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Boards)
    private readonly boardRepository: Repository<Boards>,
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
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
    file: Express.Multer.File,
  ): Promise<void> {
    const board = await this.findOneBoards(boardId);

    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

      const fileExt = extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        throw new BadRequestException('올바른 JPEG, PNG, GIF 파일이 아닙니다.');
      }

      await this.s3Service.putObject(file);

      if (board.thumbnail) {
        await this.s3Service.deleteObject(board.thumbnail);
      }
      updateBoardDto: UpdateBoardDto;
      board.thumbnail = file.filename;

      await this.boardRepository.save(board);
    } else {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }

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

    const likedUser = await this.likeRepository.findOne({
      where: {
        boardId,
        userId,
      },
    });

    if (likedUser) {
      await this.likeRepository.delete(likedUser);

      board.likedCount--;
    } else {
      await this.likeRepository.save({
        userId,
        boardId,
      });

      // 좋아요 수 증가
      board.likedCount++;

      // 좋아요 알림 발송
      this.socketGateway.LikeNotification(boardId, userId);
    }

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
