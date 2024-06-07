import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BookService } from '../book.service';
import { Book } from '../book';
import { AuthService } from '../../auth/authService.service';
import { BookFilterService } from '../book-filter-service.service';

@Component({
  selector: 'app-books-list',
  templateUrl: './booksList.component.html',
  styleUrls: ['./booksList.component.css'],
})
export class BooksListComponent implements OnInit {
  bookList: Book[] = [];
  right: boolean;
  log: boolean;

  filteredBookList: Book[] = [];
  filterCriteria: Partial<Book> & { categories?: string } = {};
  groupBy: keyof Book | '' = '';
  categories: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private bookService: BookService,
    private bookFilterService: BookFilterService
  ) { }

  ngOnInit(): void {
    this.bookService.getBooks().then(books => {
      this.bookList = books;
    });
    this.right = this.authService.hasPermission(["Super Admin", "Admin"]);
    this.authService.log$.subscribe(log => this.log = log);
    this.filteredBookList = this.bookFilterService.filterBooks(this.bookList, this.filterCriteria);
    this.filteredBookList = this.bookFilterService.sortBooksByTitle(this.filteredBookList);
  }

  onFilterChange(): void {
    this.filteredBookList = this.bookFilterService.filterBooks(this.bookList, this.filterCriteria);
  }

  onGroupChange(): void {
    if (this.groupBy) {
      this.filteredBookList = Object.values(this.bookFilterService.groupBooks(this.filteredBookList, this.groupBy)).flat();
    } else {
      this.filteredBookList = this.bookFilterService.filterBooks(this.bookList, this.filterCriteria);
    }
  }

  detail(book: Book) {
    this.router.navigateByUrl(`book/${book.bookId}`);
  }
}
