import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create_board.dto';
import { UpdateBoardDto } from './dto/update_board.dto';
import { SearchBoardDto } from './dto/serach_board.dto';
import { Boards } from './entities/board.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  // 게시물 전체 조회
  @Get('')
  async getAllBoards() {
    return await this.boardService.getAllBoards();
  }

  // 게시물 검색
  @Get('search')
  async searchBoards(
    @Query() searchBoardDto: SearchBoardDto,
  ): Promise<Boards[]> {
    console.log('test');
    return this.boardService.searchBoards(searchBoardDto);
  }

  // 게시물 단건 조회
  @Get('/:boardId')
  async findOneBoards(@Param('boardId') boardId: number) {
    return await this.boardService.findOneBoards(boardId);
  }

  // 게시물 생성
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @UploadedFile() file: Express.Multer.File,
    @UserInfo() user: User,
  ) {
    const userId = user.user_id;
    await this.boardService.createBoard(createBoardDto, file, userId);

    return { message: '게시물 생성 완료' };
  }

  // 게시물 수정
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:boardId')
  @UseInterceptors(FileInterceptor('file'))
  async updateBoard(
    @Param('boardId') boardId: number,
    @Body() updateBoardDto: UpdateBoardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updateBoard = await this.boardService.updateBoard(
      boardId,
      updateBoardDto,
      file,
    );
    return {
      updateBoard,
      message: '게시물이 정상적으로 수정되었습니다.',
    };
  }

  // 게시물 삭제
  @UseGuards(AuthGuard('jwt'))
  @Delete('/:boardId')
  async deleteBoard(@Param('boardId') boardId: number) {
    const deleteBoard = await this.boardService.deleteBoard(boardId);
    return {
      deleteBoard,
      message: '게시물이 정상적으로 삭제되었습니다.',
    };
  }

  // 게시물 좋아요
  @UseGuards(AuthGuard('jwt'))
  @Post('/:boardId/like')
  async likeBoard(@Param('boardId') boardId: number, @UserInfo() user: User) {
    const userId = user.user_id;
    const like = await this.boardService.likeBoard(boardId, userId);
    return {
      like,
    };
  }
}
