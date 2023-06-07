import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommentsUrls } from '../models/urls';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private _http: HttpClient = inject(HttpClient);
  editActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  comment!: Comment;

  constructor() {}

  getCommentsById(id: string): Observable<any> {
    return this._http.get(`${CommentsUrls.getCommentByIdUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  getCommentsByUserId(id: string): Observable<any> {
    return this._http.get(`${CommentsUrls.getUserCommentsUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  addComment(description: string, user: string): Observable<any> {
    return this._http.post(
      `${CommentsUrls.createCommentUrl}`,
      {
        user,
        description,
      },
      {
        headers: {
          Authorization: 'Bearer token',
        },
        withCredentials: true,
      }
    );
  }

  editComment(id: string) {
    this.getCommentsById(id).subscribe((res) => {
      if (res.status === 'success') {
        this.comment = res.data;
        this.editActive.next(true);
      }
    });
  }

  updateComment(
    id: string,
    user: string,
    description: string
  ): Observable<any> {
    return this._http.patch(
      `${CommentsUrls.updateCommentByIdUrl}${id}`,
      {
        user,
        description,
      },
      {
        headers: {
          Authorization: 'Bearer token',
        },
        withCredentials: true,
      }
    );
  }
}
