import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';

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

  @Post(':postId')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.commentsService.create(user, postId, createCommentDto);
  }

  @Get(':postId')
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('postId') postId: string,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: SortOptions,
    @Query('sortOrder') sortOrder?: SortOrder,
  ) {
    return this.commentsService.findAll(
      postId,
      offset,
      limit,
      sortBy,
      sortOrder,
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.commentsService.update(user, id, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req['user'] as JwtPayload;

    return this.commentsService.remove(user, id);
  }
}
