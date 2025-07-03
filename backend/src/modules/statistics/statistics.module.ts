import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Post, PostSchema } from '../posts/schemas/post.schema';
import {
  Comment,
  CommentSchema,
} from '../posts/comments/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
