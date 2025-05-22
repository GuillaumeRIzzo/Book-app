import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService } from './author.service';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsListComponent } from './authorsList/authorsList.component';
import { AddAuthorComponent } from './addAuthor/addAuthor.component';
import { authGuard } from '../auth/auth.guard';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorDetailsComponent } from './authorDetails/authorDetails.component';
import { AuthorFormComponent } from './authorForm/authorForm.component';
import { EditAuthorComponent } from './editAuthor/editAuthor.component';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const authRoute: Routes = [
  { path: "edit/author/:id", component: EditAuthorComponent, canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "author/add", component: AddAuthorComponent, canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "authors", component: AuthorsListComponent },
  { path: "author/:id", component: AuthorDetailsComponent },
];

@NgModule({
  declarations: [
    AuthorsListComponent,
    AuthorFormComponent,
    AddAuthorComponent,
    AuthorDetailsComponent,
    EditAuthorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    RouterModule.forChild(authRoute)
  ],
  providers: [AuthorService]
})
export class AuthorModule { }
