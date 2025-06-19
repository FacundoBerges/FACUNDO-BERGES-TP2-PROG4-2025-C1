import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  UseGuards,
  Req,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
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

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.commentsService.create(user, id, createCommentDto);
  }

  @Get(':postId')
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('postId') postId: string,
    @Query('offset', ParseIntPipe) offset?: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('sortBy') sortBy?: SortOptions,
    @Query('orderBy') orderBy?: SortOrder,
  ) {
    return this.commentsService.findAll(postId, offset, limit, sortBy, orderBy);
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

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id') id: string) {
  //   return this.commentsService.remove(id);
  // }
}
