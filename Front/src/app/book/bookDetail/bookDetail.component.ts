import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from '../book';
import { AuthorService } from '../../author/author.service';
import { Author } from '../../author/author';

@Component({
  selector: 'app-book-detail',
  templateUrl: './bookDetail.component.html',
  styleUrl: './bookDetail.component.css',
})
export class BookDetailComponent implements OnInit {
  book: Book;
  author: Author;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorService,
  ) { }

 async ngOnInit() {
    const bookId: string | null = this.route.snapshot.paramMap.get('id');
    if (bookId) {
     this.book = await this.bookService.getBookById(+bookId);
     this.author = await this.authorService.getAuthor(this.book.authorId);
    }
  }

  onRated(rating: number) {
    console.log('Rated:', rating);
    // You can perform any action here with the rating value
  }

  deletBook(book: Book) {
    // this.bookService.deleteBookById(book.pokedex_id);
    // this.router.navigate(["/books"]);
  }

  goBack() {
    this.router.navigate(["/books"]);
  }
  
  goToBook(bookId: number) {
    // this.router.navigate(["/book/",bookId]);
    // this.bookService.getBookById(bookId);
    // this.bookService.bookSelected$.subscribe(book => this.book = book);
  }
  
  goToEditBook(book: Book) {
    // this.router.navigate(["edit/book/", book.pokedex_id]);
  }
  goToAuthor(author: number) {
    this.router.navigate(["/author/", author]);
  }
}
