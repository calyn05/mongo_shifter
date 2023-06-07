import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftsUrls } from '../models/urls';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  private _http: HttpClient = inject(HttpClient);

  constructor() {}

  getUserShifts(id: string): Observable<any> {
    return this._http.get(`${ShiftsUrls.getUserShiftsUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }

  createShift(
    title: string,
    start: Date,
    end: Date,
    wage: number,
    user: string,
    location: string,
    description: string
  ): Observable<any> {
    return this._http.post(
      `${ShiftsUrls.createShiftUrl}`,
      {
        title,
        start,
        end,
        wage,
        user,
        location,
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

  updateShift(
    id: string,
    title?: string,
    start?: Date,
    end?: Date,
    wage?: number,
    location?: string,
    description?: string
  ): Observable<any> {
    return this._http.patch(
      `${ShiftsUrls.updateShiftByIdUrl}${id}`,
      {
        title,
        start,
        end,
        wage,
        location,
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

  getShiftById(id: string): Observable<any> {
    return this._http.get(`${ShiftsUrls.getShiftByIdUrl}${id}`, {
      headers: {
        Authorization: 'Bearer token',
      },
      withCredentials: true,
    });
  }
}
