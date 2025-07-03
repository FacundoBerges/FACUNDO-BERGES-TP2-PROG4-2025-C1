import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { Comment } from '@core/interfaces';
import { Pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly baseUrl = `${environment.apiUrl}/posts/comments`;
  private readonly httpClient = inject(HttpClient);

  public getComments(
    postId: string,
    pagination?: Pagination
  ): Observable<Comment[]> {
    if (pagination) {
      const { limit, offset } = pagination;
      return this.httpClient.get<Comment[]>(
        `${this.baseUrl}/${postId}?limit=${limit}&offset=${offset}`
      );
    }

    return this.httpClient.get<Comment[]>(`${this.baseUrl}/${postId}`);
  }

  public addComment(postId: string, comment: string): Observable<Comment> {
    return this.httpClient.post<Comment>(`${this.baseUrl}/${postId}`, {
      content: comment,
    });
  }

  public updateComment(
    commentId: string,
    partialComment: Partial<Comment>
  ): Observable<Comment> {
    return this.httpClient.patch<Comment>(
      `${this.baseUrl}/${commentId}`,
      partialComment
    );
  }
}
