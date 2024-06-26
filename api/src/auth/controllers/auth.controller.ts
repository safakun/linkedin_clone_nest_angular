import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { User } from '../models/user.class';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() user: User): Observable<User> {
        return this.authService.registerAccount(user);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() user: User): Observable<{token: string}> {
        return this.authService.login(user).pipe(map((jwt: string | any) => ({ token: jwt })));
    }
}


