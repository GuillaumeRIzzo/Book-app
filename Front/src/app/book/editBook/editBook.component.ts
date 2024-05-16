import { Component, type OnInit } from '@angular/core';
import { Book } from '../book';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { PublisherService } from '../../publisher/publisher.service';
import { AuthorService } from '../../author/author.service';
import { BookCategoryService } from '../../book-category/bookCategory.service';
import { Author } from '../../author/author';
import { Publisher } from '../../publisher/publisher';

@Component({
  selector: 'app-edit-book',
  templateUrl: './editBook.component.html',
  styleUrl: './editBook.component.css',
})
export class EditBookComponent implements OnInit {
  book: Book | undefined;
  publisher: Publisher;
  author: Author;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private publisherService: PublisherService,
    private authorService: AuthorService,
  ) {}
  
  async ngOnInit() {
    const bookId: string | null = this.route.snapshot.paramMap.get('id');
    if (bookId) {
      this.book = await this.bookService.getBook(+bookId);
      this.publisher = await this.publisherService.getPublisher(this.book.publisherId);
      this.author = await this.authorService.getAuthor(this.book.authorId);
    }
   }

}
