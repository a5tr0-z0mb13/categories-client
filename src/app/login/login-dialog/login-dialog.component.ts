import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html'
})
export class LoginDialogComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      'username': [undefined, Validators.required]
    });
  }

  public keyup(keyCode: number): void {
    if (keyCode === 13) {
      for (const key in this.formGroup.controls) {
        if (key) {
          const formControl: FormControl = this.formGroup.get(key) as FormControl;
          formControl.markAsTouched();
          formControl.markAsDirty();
        }
      }

      if (this.formGroup.valid) {
        this.dialogRef.close(this.formGroup.value);
      }
    }
  }
}
