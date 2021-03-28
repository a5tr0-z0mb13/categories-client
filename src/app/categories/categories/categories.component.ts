import { NestedTreeControl } from '@angular/cdk/tree';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTreeNestedDataSource } from '@angular/material';

import { arrayToTree, TreeItem } from 'performant-array-to-tree';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { CategoriesService } from '../categories.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { Category } from '../category.model';
import { DropEvent } from '../drop.event';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject<void>();

  public treeControl: NestedTreeControl<TreeItem>;
  public dataSource: MatTreeNestedDataSource<TreeItem>;

  public hasChildren = (_: number, treeItem: TreeItem): boolean => treeItem.children.length > 0;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoriesService: CategoriesService
  ) {}

  public ngOnInit(): void {
    this.categoriesService.message.pipe(takeUntil(this.unsubscribe)).subscribe((message: string) => {
      if (message) {
        this.snackBar.open(message);
      }
    });

    this.treeControl = new NestedTreeControl<TreeItem>((treeItem: TreeItem) => treeItem.children);
    this.dataSource = new MatTreeNestedDataSource<TreeItem>();

    this.categoriesService.categories.pipe(takeUntil(this.unsubscribe)).subscribe((categories: any) => {
      if (categories) {
        const treeItems: TreeItem[] = arrayToTree(categories);

        this.treeControl.dataNodes = treeItems;
        this.treeControl.expandAll();

        this.dataSource.data = treeItems;
      }
    });

    this.categoriesService.refresh();
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public openDialog(parentId?: number, beforeUpdate?: Category): void {
    const dialogConfig: MatDialogConfig = <MatDialogConfig>{ data: {} };

    if (beforeUpdate) {
      dialogConfig.data['category'] = beforeUpdate;
    }

    const dialogRef: MatDialogRef<any> = this.dialog.open(CategoryDialogComponent, dialogConfig);

    dialogRef.afterClosed().pipe(first()).subscribe((afterUpdate: Category) => {
      if (afterUpdate) {
        if (beforeUpdate) {
          this.update(Category.deserialize(Object.assign(beforeUpdate, afterUpdate), ['update']));
        } else {
          if (parentId) {
            afterUpdate.parentId = parentId;
          }

          this.create(Category.deserialize(afterUpdate, ['create']));
        }
      }
    });
  }

  public dropped(event: DropEvent): void {
    if (event.fromId !== event.toId && !this.isDescendent(event.fromId, event.toId)) {
      const category: Category = new Category();
      category.id = parseInt(event.fromId, 10);
      category.parentId = parseInt(event.toId, 10);
      this.update(category);
    }
  }

  public isDescendent(fromId: string, toId: string) {
    const treeItem: TreeItem = this.findById(this.dataSource.data, parseInt(fromId, 10));
    return !!this.findById(treeItem.children, parseInt(toId, 10));
  }

  // @todo: probably not the most performant way of doing things
  private findById(treeItems: TreeItem[], id: number): TreeItem {
    const found: TreeItem = treeItems.find((treeItem: TreeItem) => {
      return parseInt(treeItem.data.id, 10) === id;
    });

    if (found) {
      return found;
    } else {
      for (let i = 0; i < treeItems.length; i++) {
        const foundInChildren: TreeItem = this.findById(treeItems[i].children, id);

        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }
  }

  public create(category: Category) {
    this.categoriesService.sendRequest('POST', `${ environment.categoriesEndpoint }`, { body: category }).pipe(first()).subscribe(
      (response: HttpResponse<any>) => this.handleSuccess(),
      (error: HttpErrorResponse) => this.handleError('ERROR: Unable to create category')
    );
  }

  public update(category: Category) {
    this.categoriesService.sendRequest('PATCH', `${ environment.categoriesEndpoint }`, { body: category }).pipe(first()).subscribe(
      (response: HttpResponse<any>) => this.handleSuccess(),
      (error: HttpErrorResponse) => this.handleError('ERROR: Unable to update category')
    );
  }

  public delete(category: Category) {
    this.categoriesService.sendRequest('DELETE', `${ environment.categoriesEndpoint }/${ category.id }`).pipe(first()).subscribe(
      (response: HttpResponse<any>) => this.handleSuccess(),
      (error: HttpErrorResponse) => this.handleError('ERROR: Unable to delete category')
    );
  }

  private handleSuccess(): void {
    this.categoriesService.refresh(sessionStorage.getItem('username'));
  }

  private handleError(message: string): void {
    this.snackBar.open(message);
  }
}
