import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from '../categories/categories/categories.component';
import { IsLoggedInGuard } from '../login/is-logged-in.guard';

const routes: Routes = [
  // The login path. No component (it will open a dialog)
  { path: 'login', children: [] },
  // The default path. Redirects to the categories path
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  // The categories path. The user must be logged in to activate it
  { path: 'categories', component: CategoriesComponent, canActivate: [IsLoggedInGuard]}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class RoutesModule {}
