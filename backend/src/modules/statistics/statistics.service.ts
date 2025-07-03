import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostDocument, Post } from '../posts/schemas/post.schema';
import {
  Comment,
  CommentDocument,
} from '../posts/comments/schemas/comment.schema';
import { PostPerUserStats } from './dto/post-per-user-stats';
import { CommentsCountStats } from './dto/comments-count-stats';
import { CommentsPerPostStats } from './dto/comments-per-post-stats';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async getPostPerUser(from: Date, to: Date): Promise<PostPerUserStats[]> {
    return this.postModel.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to }, isDeleted: false } },
      { $group: { _id: '$author', postCount: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          username: '$user.username',
          postCount: 1,
        },
      },
    ]);
  }

  async getCommentsCount(from: Date, to: Date): Promise<CommentsCountStats[]> {
    const count: CommentsCountStats[] = await this.commentModel.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to }, isDeleted: false } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $project: { date: '$_id', count: 1, _id: 0 } },
      { $sort: { date: 1 } },
    ]);

    return count;
  }

  async getCommentsPerPost(
    from: Date,
    to: Date,
  ): Promise<CommentsPerPostStats[]> {
    return this.commentModel.aggregate([
      { $match: { createdAt: { $gte: from, $lte: to }, isDeleted: false } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: '$post' },
      {
        $project: {
          _id: 0,
          postId: '$post._id',
          title: '$post.title',
          count: 1,
        },
      },
    ]);
  }
}
