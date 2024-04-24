import { Test, TestingModule } from '@nestjs/testing';

const httpMocks = require('node-mocks-http');

import { FeedController } from './feed.controller';
import { FeedService } from '../services/feed.service';
import { UserService } from '../../auth/services/user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { User } from '../../auth/models/user.class';
import { FeedPost } from '../models/post.interface';

describe('FeedController', () => {

    let feedController: FeedController;
    let feedService: FeedService;
    let userService: UserService;

    const mockRequest = httpMocks.createRequest();
    mockRequest.user = new User();
    mockRequest.user.firstName = "Dmitry";

    const mockFeedPost: FeedPost = {
        body: 'body',
        createdAt: String(new Date()),
        author: mockRequest.user
    }

    const mockFeedPosts: FeedPost[] = [
        mockFeedPost,
        { ...mockFeedPost, body: 'second feed post'  },
        { ...mockFeedPost, body: 'third feed post'  }
    ]

    const mockFeedService = {
        createPost: jest.fn().mockImplementation((user: User, feedPost: FeedPost) => {
            return {
                id: 1,
                ...feedPost
            }
        }),

        findPosts: jest.fn().mockImplementation(((numberToTake: number, numberToSkip: number) => {
            const feedPostsAfterSkipping = mockFeedPosts.slice(numberToSkip);
            const feedPosts = feedPostsAfterSkipping.slice(0, numberToTake);
        }))

    }

    const mockUserService = {

    }

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [FeedController],
            providers: [FeedService, 
                {provide: UserService, useValue: mockUserService},
                {provide: JwtGuard, useValue: jest.fn().mockImplementation(() => true)},
                {provide: IsCreatorGuard, useValue: jest.fn().mockImplementation(() => true)}
            ]
        }).overrideProvider(FeedService).useValue(mockFeedService).compile();

        feedService = moduleRef.get<FeedService>(FeedService);
        userService = moduleRef.get<UserService>(UserService);

        feedController = moduleRef.get<FeedController>(FeedController);
})

    it('Should be defined', () => {
        expect(feedController).toBeDefined();
    });

    it('should create a feed post', () => {
        expect(feedController.create(mockFeedPost, mockRequest)).toEqual({
            id: expect.any(Number),
            ...mockFeedPost
        })
    })
})