import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BookService } from '../book.service';
import { Book } from '../book';
import { AuthService } from '../../auth/authService.service';

@Component({
  selector: 'app-boosk-list',
  templateUrl: './booskList.component.html',
  styleUrl: './booskList.component.css',
})
export class BooskListComponent implements OnInit {
  bookList: Book[];
  right: boolean;
  log: boolean;

  constructor(
    private router: Router,
    private authServie: AuthService,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.bookService.getBooks()
      .then(books => this.bookList = books);
      this.right = this.authServie.hasPermission(["Super Admin", "Admin"]);
      this.authServie.log$.subscribe(log => this.log = log);
  }

  detail(book: Book) {
    this.router.navigateByUrl(`book/${book.bookId}`);
  }
}
