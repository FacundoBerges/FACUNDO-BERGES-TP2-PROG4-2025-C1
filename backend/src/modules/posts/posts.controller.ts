import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
  Query,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/guards/auth.guard';
import { uploadImagePipe } from 'src/pipes/upload-image.pipe';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { OrderBy, SortBy } from './interfaces/sort-by.type';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './public/uploads/img/posts',
    }),
  )
  create(
    @Request() req: Express.Request,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(uploadImagePipe) image: Express.Multer.File,
  ) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.create(user, createPostDto, image);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('sortBy') sortBy: SortBy = 'createdAt',
    @Query('orderBy') sortOrder: OrderBy = 'desc',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Query('authorId') authorId?: string,
  ) {
    return this.postsService.findAll(
      sortBy,
      sortOrder,
      offset,
      limit,
      authorId,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: Express.Request, @Param('id') id: string) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.remove(user, id);
  }

  //* Likes endpoints

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  likePost(@Request() req: Express.Request, @Param('id') id: string) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.likePost(user, id, true);
  }

  @Post(':id/unlike')
  @HttpCode(HttpStatus.OK)
  unlikePost(@Request() req: Express.Request, @Param('id') id: string) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.likePost(user, id, false);
  }
}
