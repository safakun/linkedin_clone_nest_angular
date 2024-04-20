import { Injectable } from '@nestjs/common';
import { Observable, from, of } from 'rxjs';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { map, switchMap } from 'rxjs/operators'
import { FriendRequest, FriendRequestStatus, FriendRequest_Status } from '../models/friend-request.interface';
import { FriendRequestEntity } from '../models/friend-request.entity';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FriendRequestEntity) private readonly friendRequestRepository: Repository<FriendRequestEntity>
    ) {

    }

    findUserById(id: number): Observable<User> {
        return from(
            this.userRepository.findOne({
                where: {id},
                relations: ['feedPosts']
            })
        ).pipe(
            map((user: User | any) => {
                delete user.password;
                return user;
            })
        )
    }

    updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
        const user: User | any = new UserEntity();
        user.id = id;
        user.imagePath = imagePath;
        return from(this.userRepository.update(id, user));
    }

    findImageNameByUserId(id: number): Observable<string> {
        return from(this.userRepository.findOne({
           where: {id}
        })).pipe(
            map((user: User | any) => {
                delete user.password;
                return user.imagePath;
            })
        )
    }

    hasRequestBeenSentOrReceived(creator: User, receiver: User): Observable<boolean> {
        return from(this.friendRequestRepository.findOne({
            where: [
                { creator, receiver },
                { creator: receiver, receiver: creator }
               ]
        })).pipe(
            switchMap((friendRequest: FriendRequest | any) => {
                if (!friendRequest) return of(false);
                return of(true);
            })
        )
    }

    sendFriendRequest(receiverId: number, creator: User): Observable<FriendRequest | { error: string }> {
        if (receiverId === creator.id) return of({ error: "It is not possible to add yourself!" });

        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {
                return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
                    switchMap((hasRequestBeenSentOrReceived: boolean) => {
                        if (hasRequestBeenSentOrReceived) return of({ error: "A friend request has already been sent or received to your account!" })
                        
                            let friendRequest: FriendRequest = {
                                creator,
                                receiver,
                                status: 'pending'
                            }

                            return from(this.friendRequestRepository.save(friendRequest));
                    })
                )
            })
        )
    }

    getFriendRequestStatus(
        receiverId: number,
        currentUser: User
    ): Observable<FriendRequestStatus> {
        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {
                return from(this.friendRequestRepository.findOne({
                    where: [
                        {creator: currentUser},
                        { receiver }
                    ]
                }))
            }),
            switchMap((friendRequest: FriendRequest | any) => {
                return of({ status: friendRequest.status })
            })
        )
    }

    getFriendRequestUserById(friendRequestId: number): Observable<FriendRequest | any> {
        return from(this.friendRequestRepository.findOne({
            where: [ {id: friendRequestId} ]
        }))
    }

    respondToFriendRequest(
        statusResponse: FriendRequest_Status,
        friendRequestId: number
    ): Observable<FriendRequestStatus> {
        return this.getFriendRequestUserById(friendRequestId).pipe(
            switchMap((friendRequest: FriendRequest) => {
                return from(this.friendRequestRepository.save({
                    ...friendRequest,
                    status: statusResponse,
                }))
    })
        )
    }
}


