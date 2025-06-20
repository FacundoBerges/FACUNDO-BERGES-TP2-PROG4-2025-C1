import { Module, NotAcceptableException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { CommentsModule } from './comments/comments.module';
import { Post, PostSchema } from './schemas/post.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MulterModule.register({
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.toLowerCase().startsWith('image/')) {
          callback(
            new NotAcceptableException('Sólo se permiten imágenes'),
            false,
          );
          return;
        }
        callback(null, true);
      },
      limits: {
        files: 1,
      },
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, `./public/uploads/img/posts`);
        },
        filename(req, file, callback) {
          const now = Date.now();
          const filename = `${now}-${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
