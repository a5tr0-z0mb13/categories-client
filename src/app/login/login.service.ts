import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private redirectUrl: string;

  public get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('username');
  }

  constructor(private router: Router) {}

  public login(redirectUrl: string): void {
    this.redirectUrl = redirectUrl;

    this.router.navigate(['login']);
  }

  public loginAndRedirect(username: string): void {
    sessionStorage.setItem('username', username);

    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);

      delete this.redirectUrl;
    } else {
      this.router.navigate(['categories']);
    }
  }

  public logout(): void {
    sessionStorage.removeItem('username');

    delete this.redirectUrl;

    this.router.navigate(['login']);
  }
}
