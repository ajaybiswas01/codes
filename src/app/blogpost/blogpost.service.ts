import { Injectable } from '@angular/core';
import { Blogpost } from './blogpost';
import { Category } from './category';
import { HttpClient, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CommonserviceService } from '../services/commonservice.service';
import { apiUrl } from '../app.constant';
@Injectable({
  providedIn: 'root'
})
export class BlogpostService {

  ServerUrl = environment.baseUrl;
  errorData: {};

  private http: HttpClient;
  OrganizerID: any;
  constructor(handler: HttpBackend, private commonserviceService: CommonserviceService) {
      this.http = new HttpClient(handler);
  }

  getOrganizerService() {
    const payload = {
      Key: this.commonserviceService.authKey(),
    };
    this.commonserviceService.postservice(apiUrl.organizer, payload)
      .subscribe(data => {
        console.log('data', data)
        this.OrganizerID = data.OrganizerID; 
      }, error => {
        console.error("Error!", error.error.message);
        alert(error.error.message);
      });
  }
  getBlogs() {
    return this.http.get<Blogpost>(this.ServerUrl + 'api/blogs').pipe(
      catchError(this.handleError)
    );
  }

  getFeaturedBlogs() {
    return this.http.get<Blogpost>(this.ServerUrl + 'api/featured_blogs').pipe(
      catchError(this.handleError)
    );
  }

  getBlog(id: number) {
    return this.http.get<Blogpost>(this.ServerUrl + 'api/blog/' + id)
    .pipe(
      catchError(this.handleError)
    );
  }

  getRecentBlogs() {
    return this.http.get<Blogpost>(this.ServerUrl + 'api/recent_blogs').pipe(
      catchError(this.handleError)
    );
  }

  getCategories() {
    return this.http.get<Category>(this.ServerUrl + 'api/categories').pipe(
      catchError(this.handleError)
    );
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
