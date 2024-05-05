import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../models/conversation.entity';
import { Repository } from 'typeorm';
import { ActiveConversationEntity } from '../models/active-conversation.entity';
import { MessageEntity } from '../models/message.entity';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { Conversation } from '../models/conversation.interface';
import { User } from '../../auth/models/user.class';

@Injectable()
export class ConversationService {
    
    constructor(
        @InjectRepository(ConversationEntity) 
        private readonly conversationRepository: Repository<ConversationEntity>,

        @InjectRepository(ActiveConversationEntity) 
        private readonly activeConversationRepository: Repository<ActiveConversationEntity>,

        @InjectRepository(MessageEntity) 
        private readonly messageRepository: Repository<MessageEntity>,
    ) {}


    getConversation(creatorId: number, friendId: number): Observable<Conversation | undefined> {
        return from(
            this.conversationRepository
            .createQueryBuilder('conversation')
            .leftJoin('conversation.users', 'user')
            .where('user.id = :creatorId', { creatorId })
            .orWhere('user.id = :friendId', { friendId })
            .groupBy('conversation.id')
            .having('COUNT() > 1')
            .getOne(),
        ).pipe(map((conversation: Conversation | any) => conversation || undefined));
    }

    createConversation(creator: User, friend: User): Observable<Conversation> {
        return this.getConversation(creator.id, friend.id).pipe(
            switchMap((conversation: Conversation) => {
                const doesConversationExists = !!conversation;

                if (!doesConversationExists) {
                    const newConversation: Conversation = {
                        users: [creator, friend],
                    }
                    return from(this.conversationRepository.save(newConversation))
                }
                return of(conversation);
            })
        )
    }

}
