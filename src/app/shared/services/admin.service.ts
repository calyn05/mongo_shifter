import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminUrls } from '../models/urls';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private _http: HttpClient = inject(HttpClient);

  constructor() {}

  getAllUsers(): Observable<any> {
    return this._http.get(`${AdminUrls.getAllUsersUrl}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  deleteUser(id: string): Observable<any> {
    return this._http.delete(`${AdminUrls.deleteUserUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  getShiftsBetweenDates(from: Date, to: Date): Observable<any> {
    return this._http.get(`${AdminUrls.getShiftsByDateUrl}${from}/${to}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  deleteShift(id: string): Observable<any> {
    return this._http.delete(`${AdminUrls.deleteShiftUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  getAllShifts(): Observable<any> {
    return this._http.get(`${AdminUrls.getAllShiftsUrl}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  deleteComment(id: string): Observable<any> {
    return this._http.delete(`${AdminUrls.deleteCommentUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }
}
