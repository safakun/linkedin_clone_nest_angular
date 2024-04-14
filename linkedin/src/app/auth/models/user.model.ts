import { Post } from "src/app/home/models/Post";

export type Role = 'admin' | 'premiun' | 'user';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    posts: Post[];
}