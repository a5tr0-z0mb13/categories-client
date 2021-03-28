import { getTestBed, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginService } from './login.service';

describe('LoginService', () => {
  const redirectUrl = 'categories';

  let loginService: LoginService;

  let router: Router;
  let navigate: jasmine.Spy;
  let navigateByUrl: jasmine.Spy;

  let getItem: jasmine.Spy;
  let removeItem: jasmine.Spy;
  let setItem: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LoginService]
    });

    const testBed: TestBed = getTestBed();

    loginService = testBed.get(LoginService);

    router = testBed.get(Router);
    navigate = spyOn(router, 'navigate');
    navigateByUrl = spyOn(router, 'navigateByUrl');

    getItem = spyOn(sessionStorage, 'getItem');
    removeItem = spyOn(sessionStorage, 'removeItem');
    setItem = spyOn(sessionStorage, 'setItem');
  });

  describe('injector', () => {
    it('should provide the service', () => {
      expect(loginService).toBeTruthy();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if the username item has been set', () => {
      getItem = getItem.and.returnValue('username');

      expect(loginService.isLoggedIn).toBeTruthy();
    });

    it('should return false if the username item has not been set', () => {
      getItem = getItem.and.returnValue(undefined);

      expect(loginService.isLoggedIn).toBeFalsy();
    });
  });

  describe('login', () => {
    it('should call the navigate function', () => {
      loginService.login(redirectUrl);

      expect(navigate).toHaveBeenCalledWith(['login']);
    });
  });

  describe('loginAndRedirect', () => {
    it('should call the setItem function', () => {
      loginService.loginAndRedirect('username');

      expect(setItem).toHaveBeenCalledWith('username', 'username');
    });

    it('should call the navigateByUrl function if the redirectUrl has been set', () => {
      loginService.login(redirectUrl);

      loginService.loginAndRedirect('username');

      expect(navigateByUrl).toHaveBeenCalledWith(redirectUrl);
    });

    it('should call the navigate function if the redirectUrl has not been set', () => {
      loginService.loginAndRedirect('username');

      expect(navigate).toHaveBeenCalledWith(['categories']);
    });
  });

  describe('logout', () => {
    it('should call the removeItem and navigate functions', () => {
      loginService.logout();

      expect(removeItem).toHaveBeenCalledWith('username');
      expect(navigate).toHaveBeenCalledWith(['login']);
    });
  });
});
