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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from 'src/guards/auth.guard';
import { uploadImagePipe } from 'src/pipes/upload-image.pipe';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { OrderBy, SortBy } from './interfaces/sort-by.type';

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
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(uploadImagePipe) image: Express.Multer.File,
  ) {
    return this.postsService.create(createPostDto, image);
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
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  //* Likes endpoints

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  likePost(@Param('id') id: string) {
    return this.postsService.likePost(id, true);
  }

  @Post(':id/unlike')
  @HttpCode(HttpStatus.OK)
  unlikePost(@Param('id') id: string) {
    return this.postsService.likePost(id, false);
  }
}
