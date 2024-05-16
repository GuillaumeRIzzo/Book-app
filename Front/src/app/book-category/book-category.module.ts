import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BookCategoryListComponent } from './bookCategoryList/bookCategoryList.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BookCategoryService } from './bookCategory.service';
import { AddbookcategoryComponent } from './addbookcategory/addbookcategory.component';
import { authGuard } from '../auth/auth.guard';
import { BookCategoryDetailsComponent } from './bookCategoryDetails/bookCategoryDetails.component';
import { BookCategoryEditComponent } from './bookCategoryEdit/bookCategoryEdit.component';
import { BookCategoryFormComponent } from './bookCategoryForm/bookCategoryForm.component';


const bookCategoryRoute: Routes = [
  { path: "edit/bookcategory/:id", component: BookCategoryEditComponent,  canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "bookcategory/add", component: AddbookcategoryComponent,  canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "bookscategories", component: BookCategoryListComponent },
  { path: "bookcategory/:id", component: BookCategoryDetailsComponent },
];

@NgModule({
  declarations: [
    BookCategoryListComponent,
    BookCategoryFormComponent,
    AddbookcategoryComponent,
    BookCategoryEditComponent,
    BookCategoryDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    RouterModule.forChild(bookCategoryRoute)
  ],
  providers: [BookCategoryService]
})
export class BookCategoryModule { }
