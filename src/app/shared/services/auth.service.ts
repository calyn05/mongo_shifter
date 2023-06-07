import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserUrls } from '../models/urls';
import { UserModel } from '../models/user.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http: HttpClient = inject(HttpClient);

  constructor() {}

  username!: string;
  admin!: boolean;

  login(email: string, password: string): Observable<any> {
    return this._http.post<UserModel>(
      `${UserUrls.loginUrl}`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
  }

  logout(): Observable<any> {
    return this._http.post(
      `${UserUrls.logoutUrl}`,
      {},
      {
        withCredentials: true,
      }
    );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    permissions: string
  ): Observable<any> {
    return this._http.post<UserModel>(
      `${UserUrls.registerUrl}`,
      {
        email,
        password,
        firstName,
        lastName,
        permissions,
      },
      {
        withCredentials: true,
      }
    );
  }

  isAdmin(): Observable<boolean> {
    return of(document.cookie.includes('true'));
  }

  isLoggedIn(): Observable<string> {
    return of(document.cookie);
  }

  updateUser(id: string, user: any): Observable<any> {
    console.log(user);
    console.log({
      _id: id,
      ...user,
    });
    return this._http.patch(
      `${UserUrls.updateMeUrl}`,
      {
        _id: id,
        ...user,
      },
      {
        headers: {
          Authorization: 'Bearer token',
        },
        withCredentials: true,
      }
    );
  }

  updatePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this._http.patch(
      `${UserUrls.updatePasswordUrl}`,
      {
        _id: id,
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: 'Bearer token',
        },
        withCredentials: true,
      }
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this._http.post(
      `${UserUrls.forgotPasswordUrl}`,
      {
        email,
      },
      {
        withCredentials: true,
      }
    );
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this._http.patch(
      `${UserUrls.resetPasswordUrl}${token}`,
      {
        password,
      },
      {
        withCredentials: true,
      }
    );
  }
}
