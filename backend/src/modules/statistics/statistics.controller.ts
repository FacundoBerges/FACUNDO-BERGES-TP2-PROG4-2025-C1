import { Controller, Get, UseGuards, Query } from '@nestjs/common';

import { StatisticsService } from './statistics.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('posts/statistics')
@UseGuards(AuthGuard, AdminGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('post-per-user')
  async findPostPerUser(@Query('from') from: string, @Query('to') to: string) {
    const statistics = await this.statisticsService.getPostPerUser(
      new Date(from),
      new Date(to),
    );

    return {
      labels: statistics.map((stat) => stat.username),
      data: statistics.map((stat) => stat.postCount),
    };
  }

  @Get('comments-count')
  async findCommentsCount(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const statistics = await this.statisticsService.getCommentsCount(
      new Date(from),
      new Date(to),
    );

    return {
      labels: statistics.map((stat) => stat.date),
      data: statistics.map((stat) => stat.count),
    };
  }

  @Get('comments-per-post')
  async findCommentsPerPost(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const statistics = await this.statisticsService.getCommentsPerPost(
      new Date(from),
      new Date(to),
    );

    return {
      labels: statistics.map((stat) => stat.title),
      data: statistics.map((stat) => stat.count),
    };
  }
}
