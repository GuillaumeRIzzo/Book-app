import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule, Routes } from '@angular/router';
import { BookService } from './book.service';
import { authGuard } from '../auth/auth.guard';
import { AddBookComponent } from './addBook/addBook.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BookDetailComponent } from './bookDetail/bookDetail.component';
import { RatingComponent } from '../rating/rating.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { BookFormComponent } from './bookForm/bookForm.component';
import { EditBookComponent } from './editBook/editBook.component';
import { MatButtonModule } from '@angular/material/button';
import { BooksListComponent } from './booksList/booksList.component';


const bookRoute: Routes = [
  { path: "edit/book/:id", component: EditBookComponent,  canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "book/add", component: AddBookComponent,  canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "books", component: BooksListComponent },
  { path: "book/:id", component: BookDetailComponent },
];

@NgModule({
  declarations: [
    BooksListComponent,
    BookDetailComponent,
    BookFormComponent,
    AddBookComponent,
    EditBookComponent,
    RatingComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    RouterModule.forChild(bookRoute)
  ],
  providers: [BookService, DatePipe]
})
export class BookModule { }
