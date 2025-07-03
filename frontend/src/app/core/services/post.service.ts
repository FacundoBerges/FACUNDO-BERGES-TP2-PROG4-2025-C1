import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { CreatePost, Post, Sorting, Pagination } from '@core/interfaces/';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/posts`;

  public getPosts(
    sorting?: Sorting,
    pagination?: Pagination,
    authorId?: string
  ): Observable<Post[]> {
    let url = this.baseUrl;

    if (sorting) {
      const sortBy = sorting.sortBy ? `sortBy=${sorting.sortBy}` : '';
      const sortOrder = sorting.sortOrder
        ? `&sortOrder=${sorting.sortOrder}`
        : '';
      url += `?${sortBy}${sortOrder}`;
    }

    if (pagination) {
      const page = pagination.offset ? `offset=${pagination.offset}` : '';
      const limit = pagination.limit ? `&limit=${pagination.limit}` : '';
      url += `${url.includes('?') ? '&' : '?'}${page}${limit}`;
    }

    if (authorId) {
      url += `${url.includes('?') ? '&' : '?'}authorId=${authorId}`;
    }

    return this.httpClient.get<Post[]>(url);
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

  public deletePost(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  public likePost(id: string, isLike: boolean): Observable<Post> {
    const like: 'like' | 'unlike' = isLike ? 'like' : 'unlike';

    return this.httpClient.post<Post>(`${this.baseUrl}/${like}/${id}`, {});
  }
}
