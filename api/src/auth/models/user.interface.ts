import { FeedPost } from "src/feed/models/post.interface";
import { Role } from "./role.enum";

export interface User {
    if?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: Role;
    posts: FeedPost[];
}