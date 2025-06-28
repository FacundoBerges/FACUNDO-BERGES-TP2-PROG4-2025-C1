import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { CreatePost, Post } from '@core/interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/posts`;

  public getPosts(): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.baseUrl);
  }

  public getPostById(id: string): Observable<Post> {
    return this.httpClient.get<Post>(`${this.baseUrl}/${id}`);
  }

  public createPost(post: CreatePost): Observable<Post> {
    if (!post.image) {
      const jsonPost = { title: post.title, description: post.description };

      return this.httpClient.post<Post>(this.baseUrl, jsonPost);
    }

    const formDataPost = new FormData();

    Object.entries(post).forEach(([key, value]) => {
      formDataPost.append(key, value);
    });

    return this.httpClient.post<Post>(this.baseUrl, formDataPost);
  }

  public likePost(id: string, isLike: boolean): Observable<Post> {
    const like: 'like' | 'unlike' = isLike ? 'like' : 'unlike';

    return this.httpClient.post<Post>(`${this.baseUrl}/${like}/${id}`, {});
  }
}
