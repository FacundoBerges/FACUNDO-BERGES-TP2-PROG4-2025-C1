import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';

import { AuthGuard } from 'src/guards/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';
import { SortOrder, SortOptions } from '../interfaces/sort-by.type';

@Controller('posts/comments')
@UseGuards(AuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':id')
  create(
    @Request() req: Express.Request,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.commentsService.create(user, id, createCommentDto);
  }

  @Get(':id')
  findAll(
    @Param('id') id: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: SortOptions = 'createdAt',
    @Query('orderBy') orderBy: SortOrder = 'desc',
  ) {
    return this.commentsService.findAll(id, offset, limit, sortBy, orderBy);
  }

  @Patch(':id')
  update(
    @Request() req: Express.Request,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.commentsService.update(user, id, updateCommentDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.commentsService.remove(+id);
  // }
}
