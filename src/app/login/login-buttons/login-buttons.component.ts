import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { LoginService } from '../login.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-login-buttons',
  templateUrl: './login-buttons.component.html'
})
export class LoginButtonsComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public loginService: LoginService
  ) {}

  public ngOnInit(): void {
    this.router.events.pipe(takeUntil(this.unsubscribe)).subscribe((event: any) => {
      if (event instanceof NavigationEnd && (<NavigationEnd>event).url === '/login') {
        this.openDialog();
      }
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public openDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;

    const dialogRef: MatDialogRef<LoginDialogComponent> = this.dialog.open(LoginDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(first()).subscribe((value: any) => {
      if (value) {
        this.loginService.loginAndRedirect(value['username']);
      }
    });
  }

  public logout(): void {
    this.loginService.logout();
  }
}
