import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../models/Post';
import { environment } from 'src/environments/environment';

const API = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor( private http: HttpClient) { } 

  getSelectedPosts(params: string) {
    return this.http.get<Post[]>(API + '/api/feed' + params)
  }
}
