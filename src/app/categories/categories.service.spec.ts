import * as io from 'socket.io-client';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  const path = environment.categoriesEndpoint;
  const url = `${ environment.apiServerUrl }${ environment.categoriesEndpoint }`;

  const category: any = {
    id: 2,
    parentId: 1,
    label: 'Label'
  };

  let categoriesService: CategoriesService;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let socket: SocketIOClient.Socket;
  let emit: jasmine.Spy;
  let on: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CategoriesService,
        {
          provide: 'socket',
          useValue: {
            emit: () => {},
            on: () => {}
          }
        }
      ]
    });

    const testBed: TestBed = getTestBed();

    categoriesService = testBed.get(CategoriesService);

    httpClient = testBed.get(HttpClient);
    httpTestingController = testBed.get(HttpTestingController);

    socket = testBed.get('socket');
    emit = spyOn(socket, 'emit');
    on = spyOn(socket, 'on');
  });

  describe('injector', () => {
    it('should provide the service', () => {
      expect(categoriesService).toBeTruthy();
    });
  });

  /**
   * @todo: type definitions supplied with the current version of mock-socket are broken,
   * so this class can't be fully tested without spending a lot more time on it
   */

  describe('refresh', () => {
    it('should emit a refresh event with the triggeredBy parameter', () => {
      categoriesService.refresh('username');

      expect(emit).toHaveBeenCalledWith('refresh', 'username');
    });

    it('should emit a refresh event without the triggeredBy parameter', () => {
      categoriesService.refresh();

      expect(emit).toHaveBeenCalledWith('refresh', undefined);
    });
  });

  describe('sendRequest', () => {
    afterEach(() => {
      httpTestingController.verify();
    });

    it('should return an Observable<any> on success', () => {
      categoriesService.sendRequest('GET', path).subscribe(
        (response: Observable<any>) => {
          expect(response).toEqual(category);
        },
        (error: HttpErrorResponse) => {
          // Should never be called
          expect(2 + 2).toEqual(5);
        }
      );

      const testRequest: TestRequest = httpTestingController.expectOne(url);
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(category, { status: 200, statusText: 'OK' });
    });

    it('should return an HttpErrorResponse on error', () => {
      categoriesService.sendRequest('GET', path).subscribe(
        (response: Observable<any>) => {
          // Should never be called
          expect(2 + 2).toEqual(5);
        },
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(401);
          expect(error.statusText).toEqual('Unauthorized');
        }
      );

      const testRequest: TestRequest = httpTestingController.expectOne(url);
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
