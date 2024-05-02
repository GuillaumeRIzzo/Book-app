import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { BooskListComponent } from './booskList/booskList.component';
import { BookService } from './book.service';
import { authGuard } from '../auth/auth.guard';
import { AddBookComponent } from './addBook/addBook.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BookDetailComponent } from './bookDetail/bookDetail.component';
import { RatingComponent } from '../rating/rating.component';


const bookRoute: Routes = [
  { path: "books", component: BooskListComponent },
  { path: "book/:id", component: BookDetailComponent },
  { path: "addbook", component: AddBookComponent,  canActivate: [authGuard], data: { requiredPermission: 'Admin' } },
];

@NgModule({
  declarations: [
    BooskListComponent,
    AddBookComponent,
    BookDetailComponent,
    RatingComponent
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
    RouterModule.forChild(bookRoute)
  ],
  providers: [BookService]
})
export class BookModule { }
