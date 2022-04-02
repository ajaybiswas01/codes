import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CommonserviceService } from '../services/commonservice.service';
import { apiUrl } from '../app.constant';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit  {

  serverUrl = environment.baseUrl;
  errorData: {};
  redirectUrl: string;
  OrganizerID: any;
  constructor(private http: HttpClient,
    private commonserviceService: CommonserviceService) {
      
    }

    ngOnInit() {
 
    }
  login(username: string, password: string, orgID: any) {
    const payload = {
      Key: this.commonserviceService.authKey(),
      OrganizerID: orgID,
      Email: username,
      Zipcode: password
    };
    return this.http.post<any>(`${this.serverUrl}checkLogin`, payload)
    .pipe(map(user => {
        if (user && user.CustomerID) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(this.handleError)
    );
  }

  isLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  getAuthorizationToken() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser.CustomerID;
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }

}
