import { getTestBed, TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { IsLoggedInGuard } from './is-logged-in.guard';
import { LoginService } from './login.service';

describe('IsLoggedInGuard', () => {
  let isLoggedInGuard: IsLoggedInGuard;

  let loginService: LoginService;
  let isLoggedIn: jasmine.Spy;
  let login: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsLoggedInGuard],
      imports: [RouterTestingModule]
    });

    const testBed: TestBed = getTestBed();

    isLoggedInGuard = testBed.get(IsLoggedInGuard);

    loginService = testBed.get(LoginService);
    isLoggedIn = spyOnProperty(loginService, 'isLoggedIn', 'get');
    login = spyOn(loginService, 'login');
  });

  describe('injector', () => {
    it('should provide the Guard', () => {
      expect(isLoggedInGuard).toBeTruthy();
    });
  });

  describe('canActiveate', () => {
    it('should return true if the user is logged in', () => {
      isLoggedIn = isLoggedIn.and.returnValue(true);

      expect(isLoggedInGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: 'categories' })).toBeTruthy();
    });

    it('should call the login function if the user is logged in', () => {
      isLoggedIn = isLoggedIn.and.returnValue(false);

      isLoggedInGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: 'categories' });

      expect(login).toHaveBeenCalledWith('categories');
    });

    it('should return false if the user is logged in', () => {
      isLoggedIn = isLoggedIn.and.returnValue(false);

      expect(isLoggedInGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{ url: 'categories' })).toBeFalsy();
    });
  });
});
