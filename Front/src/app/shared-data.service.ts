// shared-data.service.ts
import { Injectable } from '@angular/core';
import { Author } from './author/author';
import { AuthorService } from './author/author.service';
import { Book } from './book/book';
import { BookService } from './book/book.service';
import { Publisher } from './publisher/publisher';
import { PublisherService } from './publisher/publisher.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private books: Book[] = [];
  private authors: Author[] = [];
  private publishers: Publisher[] = [];
  private dataLoaded = false;

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService
  ) {}

  async loadData() {
    if (!this.dataLoaded) {
      this.books = await this.bookService.getBooks();
      this.authors = await this.authorService.getAuthors();
      this.publishers = await this.publisherService.getPublishers();
      this.dataLoaded = true;
    }
  }

  getBooks(): Book[] {
    return this.books;
  }

  getAuthors(): Author[] {
    return this.authors;
  }

  getPublishers(): Publisher[] {
    return this.publishers;
  }
}
