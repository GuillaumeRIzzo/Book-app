import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../book';
import { AuthorService } from '../../author/author.service';
import { Author } from '../../author/author';
import { Publisher } from '../../publisher/publisher';
import { PublisherService } from '../../publisher/publisher.service';
import { AuthService } from '../../auth/authService.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './bookDetail.component.html',
  styleUrl: './bookDetail.component.css',
})
export class BookDetailComponent implements OnInit {
  book: Book;
  author: Author;
  publisher: Publisher;
  right: boolean;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private authService: AuthService
  ) { }

 async ngOnInit() {
    const bookId: string | null = this.route.snapshot.paramMap.get('id');
    if (bookId) {
     this.book = await this.bookService.getBook(+bookId);
     this.author = await this.authorService.getAuthor(this.book.authorId);
     this.publisher = await this.publisherService.getPublisher(this.book.publisherId);
    }
    this.right = this.authService.hasPermission(["Super Admin", "Admin"]);
  }

  onRated(rating: number) {
    // console.log('Rated:', rating);
    // You can perform any action here with the rating value
  }

  deletBook(book: Book) {
    this.bookService.deleteBook(book);
    this.router.navigate(["/books"]);
  }

  goBack() {
    this.router.navigate(["/books"]);
  }
  
  goToEditBook(book: Book) {
    this.router.navigate(["edit/book/", book.bookId]);
  }
  goToAuthor(author: number) {
    this.router.navigate(["/author/", author]);
  }

  goToPublisher(publisher: number) {
    this.router.navigate(["/publisher/", publisher]);
  }

  goToCatego(category: number) {
    this.router.navigate(["/category/", category]);
  }
}
