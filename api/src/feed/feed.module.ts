import { Module } from '@nestjs/common';
import { FeedService } from './services/feed.service';
import { FeedController } from './controllers/feed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPostEntity } from './models/post.entity';
import { AuthModule } from '../auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([FeedPostEntity ])
  ],
  providers: [FeedService, IsCreatorGuard],
  controllers: [FeedController]
})
export class FeedModule {}
