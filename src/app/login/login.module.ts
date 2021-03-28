import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatMenuModule } from '@angular/material';

import { IsLoggedInGuard } from './is-logged-in.guard';
import { LoginButtonsComponent } from './login-buttons/login-buttons.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { LoginService } from './login.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginButtonsComponent,
    LoginDialogComponent
  ],
  entryComponents: [LoginDialogComponent],
  providers: [
    IsLoggedInGuard,
    LoginService
  ],
  exports: [LoginButtonsComponent]
})
export class LoginModule { }
