import { Test, TestingModule } from '@nestjs/testing';

import { DeleteResult, UpdateResult } from 'typeorm';
const httpMocks = require('node-mocks-http');

import { FeedService } from '../services/feed.service';
import { User } from '../../auth/models/user.class';
import { FeedPost } from '../models/post.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FeedPostEntity } from '../models/post.entity';

describe('FeedService', () => {
  let feedService: FeedService;


  const mockRequest = httpMocks.createRequest();
  mockRequest.user = new User();
  mockRequest.user.firstName = 'Jon';

  const mockFeedPost: FeedPost = {
    body: 'body',
    createdAt: String(new Date()),
    author: mockRequest.user,
  };



  const mockFeedPostRepository = {
    createPost: jest
      .fn()
      .mockImplementation((user: User, feedPost: FeedPost) => {
        return {
          ...feedPost,
          author: user
        };
      }),
    save: jest
      .fn()
      .mockImplementation((feedPost: FeedPost) => Promise.resolve({ id: 1, ...feedPost }),
    ),
   
  };
  const mockUserService = {};


  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
     
      providers: [
        FeedService,
        { 
            provide: getRepositoryToken(FeedPostEntity),
            useValue: mockFeedPostRepository,
         },
       
      ],
    })
    //   .overrideProvider(FeedService)
    //   .useValue(mockFeedPostRepository)
      .compile();

    feedService = moduleRef.get<FeedService>(FeedService);
  });

  it('should be defined', () => {
    expect(FeedService).toBeDefined();
  });

  it('Should create a feed post', (done: jest.DoneCallback) => {
    feedService.createPost(mockRequest.user, mockFeedPost).subscribe((feedPost: FeedPost) => {
        expect(feedPost).toEqual({
            id: expect.any(Number),
            ...mockFeedPost
        })
    })
    done();
  });



  
});

