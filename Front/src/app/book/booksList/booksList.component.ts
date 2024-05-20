import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BookService } from '../book.service';
import { Book } from '../book';
import { AuthService } from '../../auth/authService.service';
import { SearchComponent } from '../../search/search.component';
import { Observable } from 'rxjs';
import { AuthorService } from '../../author/author.service';
import { PublisherService } from '../../publisher/publisher.service';
import { BookCategoryService } from '../../book-category/bookCategory.service';
import { Author } from '../../author/author';
import { Publisher } from '../../publisher/publisher';
import { BookCategory } from '../../book-category/bookCategory';

@Component({
  selector: 'app-books-list',
  templateUrl: './booksList.component.html',
  styleUrl: './booksList.component.css',
})
export class BooksListComponent implements OnInit {
  bookList: Book[];
  authors: Author[];
  publishers: Publisher[];
  categos: BookCategory[];

  right: boolean;
  log: boolean;

  searchedBook$: Observable<Book[]>;

  @ViewChild(SearchComponent) searchComponent: SearchComponent;
  ngAfterViewInit() {
    this.searchedBook$ = this.searchComponent.books$;
  }

  constructor(
    private router: Router,
    private authServie: AuthService,
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private bookCategoryService: BookCategoryService
  ) { }

  ngOnInit(): void {
    this.bookService.getBooks()
      .then(books => this.bookList = books);
      this.right = this.authServie.hasPermission(["Super Admin", "Admin"]);
      this.authServie.log$.subscribe(log => this.log = log);
    this.authorService.getAuthors()
      .then(authors => this.authors = authors);
    this.publisherService.getPublishers()
      .then(publishers => this.publishers = publishers);
    this.bookCategoryService.getBookCategories()
      .then(categos => this.categos = categos);  
  }

  detail(book: Book) {
    this.router.navigateByUrl(`book/${book.bookId}`);
  }
}
