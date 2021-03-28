import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Category } from '../category.model';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html'
})
export class CategoryDialogComponent implements OnInit {
  public formGroup: FormGroup;

  public get category(): Category {
    return this.data['category'];
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: any
  ) {}

  public ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      'label': [this.category ? this.category.label : undefined, Validators.required]
    });
  }

  public keyup(keyCode: number): void {
    if (keyCode === 13) {
      this.ok();
    }
  }

  public ok(): void {
    this.dialogRef.close(this.formGroup.value);
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
