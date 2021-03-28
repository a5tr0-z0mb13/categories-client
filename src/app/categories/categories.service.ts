import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private _message: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public message: Observable<string> = this._message.asObservable();

  private _categories: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public categories: Observable<any> = this._categories.asObservable();

  constructor(private httpClient: HttpClient, @Inject('socket') private socket: SocketIOClient.Socket) {
    this.socket.on('message', (data: any) => {
      this._message.next(data);
    });

    this.socket.on('refreshed', (data: any) => {
      this._categories.next(data);
    });
  }

  public refresh(triggeredBy?: string): void {
    this.socket.emit('refresh', triggeredBy);
  }

  public sendRequest(method: string, path: string, options?: any): Observable<any> {
    return this.httpClient.request<any>(method, `${ environment.apiServerUrl }${ path }`, options);
  }
}
