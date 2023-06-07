import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserUrls, Url } from '../models/urls';
import { DbUserModel } from '../models/db-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http: HttpClient = inject(HttpClient);

  user!: DbUserModel;

  constructor() {}

  getUserbyId(id: string): Observable<any> {
    return this._http.get(`${UserUrls.getUserbyIdUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  deleteMe(id: string): Observable<any> {
    return this._http.patch(
      `${UserUrls.deleteMeUrl}`,
      {
        _id: id,
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
