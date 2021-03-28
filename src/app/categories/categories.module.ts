import * as io from 'socket.io-client';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatTreeModule } from '@angular/material';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

import { environment } from '../../environments/environment';
import { CategoriesService } from './categories.service';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { DraggableDirective } from './draggable.directive';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatTreeModule,
    ReactiveFormsModule
  ],
  declarations: [
    CategoriesComponent,
    CategoryDialogComponent,
    DraggableDirective
  ],
  entryComponents: [
    CategoryDialogComponent
  ],
  providers: [
    CategoriesService,
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
    {
      provide: 'socket',
      useFactory: () => io(`${ environment.apiServerUrl }${ environment.categoriesNamespace }`)
    }
  ]
})
export class CategoriesModule { }
