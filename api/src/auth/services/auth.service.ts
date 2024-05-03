import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.class';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  doesUserExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: {email}  })).pipe(
      switchMap((user: User | any) => {
        return of(!!user);
      }),
    );
  }

  registerAccount(user: User): Observable<User> {
    const { firstName, lastName, email, password, position } = user;
    console.log(user);

    return this.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword: string) => {
            return from(
              this.userRepository.save({
                firstName,
                lastName,
                position,
                email,
                password: hashedPassword,
              }),
            ).pipe(
              map((user: User | any) => {
                delete user.password;
                return user;
              }),
            );
          }),
        );
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: 
            { email },
              select: ['id', 'firstName', 'lastName', 'email', 'password', 'role', 'position'],
  }),
    ).pipe(
      switchMap((user: User | any) => {
        if (!user) {
          throw new HttpException(
            { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
            HttpStatus.FORBIDDEN,
          );
        }
        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            }
          }),
        );
      }),
    );
  }

  login(user: User): Observable<string> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          // create JWT - credentials
          return from(this.jwtService.signAsync({ user }));
        }
      }),
    );
  }

  getJwtUser(jwt: string): Observable<User | null> {
    return from(this.jwtService.verifyAsync(jwt)).pipe(
      map(({ user }: { user: User }) => {
        return user;
      }),
      catchError(() => {
        return of(null);
      }),
    );
  }
}


// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { from, Observable, of } from 'rxjs';
// import { map, switchMap, tap } from 'rxjs/operators';
// import { User } from '../models/user.class';
// import { InjectRepository } from '@nestjs/typeorm';
// import { UserEntity } from '../models/user.entity';
// import { Repository } from 'typeorm';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthService {

//     constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
//     private jwtService: JwtService
//     ) {

//     }

//     hashPassword(password: string): Observable<string> {
//         return from(bcrypt.hash(password, 12));
//     }

//     doesUserExists(email: string): Observable<boolean> {
//         return from(this.userRepository.findOne({
//             where: { email }
//         })).pipe(
//             switchMap((user: User | any) => {
//                 return of(!!user);
//             })
//         )
//     }

//     registerAccount(user: User): Observable<User> {
//         const { firstName, lastName, email, password } = user;

//         return this.doesUserExists(email).pipe(
//             tap((doesUserExists: boolean) => {
//                 if (doesUserExists) throw new HttpException('A user has already created a profile with thie email', HttpStatus.BAD_REQUEST)
//             })
//         )

//         return this.hashPassword(password).pipe(
//             switchMap((hashedPassword: string) => {
//                 return from(this.userRepository.save({
//                     firstName,
//                     lastName,
//                     email,
//                     password: hashedPassword
//                 })).pipe(
//                     map((user: User | any) => {
//                         delete user.password;
//                         return user;
//                     })
//                 );
//             })
//         )
//     }

//     validateUser(email: string, password: string): Observable<User> {
//         return from(this.userRepository.findOne({
//             where: {email},
//             select: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
//          })).pipe(
//             switchMap((user: User | any) => 
//                 {
//             if (!user) {
//                 // throw new HttpException('Not found', HttpStatus.NOT_FOUND)

//                 throw new HttpException({ status: HttpStatus.NOT_FOUND, error: 'Inмalid credentials' }, HttpStatus.NOT_FOUND);
//             }
               
//     return from(bcrypt.compare(password, user.password)).pipe(
//         map((isValidPassword: boolean) => {
//             if (isValidPassword) {
//                 delete user.password;
//                 return user;
//             }
//         })
//     )
// }
             
//             )
//         )
//     }

//     login(user: User): Observable<string> {
//         const { email, password } = user;
//         return this.validateUser(email, password).pipe(
//             switchMap((user: User) => {
//                 if (user) {
//                     // Reate JWT - credentials
//                     return from(this.jwtService.signAsync({ user }))
//                 }
//             })
//         )
//     }

   
// }
