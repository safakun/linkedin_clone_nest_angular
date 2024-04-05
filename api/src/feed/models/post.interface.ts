import { User } from "src/auth/models/user.interface";

export interface FeedPost {
    id?: number;
    body?: string;
    createdAt?: string;
    author?: User;
}