import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
  private messageSource = new BehaviorSubject<any>([]);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeMessage(msg: any) {
    this.messageSource.next(msg);
  }
}