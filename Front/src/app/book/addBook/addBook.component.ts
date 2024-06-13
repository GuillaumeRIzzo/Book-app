import { Component, OnInit } from '@angular/core';

import { Book } from '../book';

@Component({
  selector: 'app-add-book',
  templateUrl: './addBook.component.html',
  styleUrl: './addBook.component.css',
})
export class AddBookComponent implements OnInit {

  book: Book;

  constructor() {}

  ngOnInit() {
    this.book = new Book();  
  }
}
