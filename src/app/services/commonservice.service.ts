import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, startWith, delay, catchError, finalize } from 'rxjs/operators';
import { projectsettings, apiUrl, messages} from './../app.constant';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommonserviceService {
  consumerKey: string;
  consumerSecret: string;
  deviceInfo: any;
  ipAddress: any = '';
  ip: any = '';
  static getservice(sitesetting: string) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    ) {
    }

  authKey(){
    const key = 'F4914406-D2CE-4504-87B3-CF17642D28A1';
    return key;
  }
  postservice(url: any, payload: any): Observable<any> {
    console.log(payload);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Authorization': 'Bearer key',
    });
    return this.http.post<any>(environment.baseUrl +  url, payload, {'headers':headers}).pipe(
      map((res: any) => res),
      catchError((error: Response) => {
        return throwError(error);
      }),
      finalize(() => {})
    );

  }

  getservice(url: any): Observable<any> {
    console.log('apicall');
    const customHeaders = this.getHeadersForHttp();
    const httpOptions = {
      headers: new HttpHeaders(customHeaders)
    };
    return this.http.get<any>(environment.baseUrl + projectsettings.path + url, httpOptions).pipe(
      map((res: any) => res),
      catchError((error: Response) => {
        return throwError(error);
      }),
      finalize(() => {})
    );

  }

  getHeadersForHttp() {
    const now: Date = new Date();
    // const ip = this.getIpAddress();
    const nonce = now.getTime().toString();

    const d = new Date();
    const id = d.getTime().toString();

    // this.consumerKey = Md5.hashStr(projectsettings.consumerKey).toString();
    // this.consumerSecret = Md5.hashStr(projectsettings.consumerSecret).toString();

    const headers = {
      'Content-Type': 'application/json',
      'auth_token': `${this.authKey()}`
    };
    console.log(headers);
    return headers;
  }



}