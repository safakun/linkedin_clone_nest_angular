import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { User } from '../models/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { map } from 'rxjs/operators'

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
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
}

