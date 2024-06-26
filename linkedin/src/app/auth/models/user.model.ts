import { Post } from "src/app/home/models/Post";

export type Role = 'admin' | 'premiun' | 'user';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    position: string;
    imagePath?: string;
    posts?: Post[];
}