import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService } from './author.service';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsListComponent } from './authorsList/authorsList.component';
import { AddAuthorComponent } from './addAuthor/addAuthor.component';
import { authGuard } from '../auth/auth.guard';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';

const authRoute: Routes = [
  { path: "authors", component: AuthorsListComponent },
  { path: "addauthor", component: AddAuthorComponent, canActivate: [authGuard], data: { requiredPermission: "Admin" || "Super Admin" } },
];

@NgModule({
  declarations: [
    AuthorsListComponent,
    AddAuthorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(authRoute)
  ],
  providers: [AuthorService]
})
export class AuthorModule { }
