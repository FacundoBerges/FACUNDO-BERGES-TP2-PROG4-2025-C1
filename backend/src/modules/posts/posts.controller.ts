import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

import { AuthGuard } from 'src/guards/auth.guard';
import { uploadImagePipe } from 'src/pipes/upload-image.pipe';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';
import { SortOrder, SortOptions } from './interfaces/sort-by.type';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  private readonly logger: Logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './public/uploads/img/posts',
    }),
  )
  create(
    @Req() req: Request,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(uploadImagePipe) image: Express.Multer.File,
  ) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.create(user, createPostDto, image);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query('sortBy') sortBy: SortOptions = 'createdAt',
    @Query('sortOrder') sortOrder: SortOrder = 'desc',
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
  remove(@Req() req: Request, @Param('id') id: string) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.remove(user, id);
  }

  //* Likes endpoints

  @Post('like/:id')
  @HttpCode(HttpStatus.OK)
  likePost(@Req() req: Request, @Param('id') id: string) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.likePost(user, id, true);
  }

  @Post('unlike/:id')
  @HttpCode(HttpStatus.OK)
  unlikePost(@Req() req: Request, @Param('id') id: string) {
    const user: JwtPayload = req['user'] as JwtPayload;

    return this.postsService.likePost(user, id, false);
  }
}
