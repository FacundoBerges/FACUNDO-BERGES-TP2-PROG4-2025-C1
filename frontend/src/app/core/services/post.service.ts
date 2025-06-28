import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Post } from '../interfaces/post';

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

  public likePost(id: string, isLike: boolean): Observable<Post> {
    const like: 'like' | 'unlike' = isLike ? 'like' : 'unlike';

    return this.httpClient.post<Post>(`${this.baseUrl}/${like}/${id}`, {});
  }
}
