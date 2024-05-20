import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged, map, of, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { BookService } from '../book/book.service';
import { Book } from '../book/book';
import { Author } from '../author/author';
import { Publisher } from '../publisher/publisher';
import { BookCategory } from '../book-category/bookCategory';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @ViewChild('searchBox') searchBox: ElementRef;
  @Input() books: Book[];
  @Input() authors: Author[];
  @Input() publishers: Publisher[];
  @Input() categories: BookCategory[];

  searchTerms = new Subject<string>();
  books$: Observable<Book[]>;

  constructor(
    private router: Router,
    private bookService: BookService,
  ) { }

  ngAfterViewInit() {
    this.searchBox.nativeElement.focus();
  }

  ngOnInit() {
    this.books$ = this.searchTerms.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchBooks(term)),
      catchError(error => {
        // Handle error here (e.g., log it or show a user-friendly message)
        console.error('Error searching books:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  searchBooks(term: string): Observable<Book[]> {
    if (term.length <= 1) {
      return of([]);
    }
  
    return of(
      this.books.map(book => {
        const authorName = this.authors.find(a => a.authorId == book.authorId)?.authorName || '';
        const publisherName = this.publishers.find(p => p.publisherId == book.publisherId)?.publisherName || '';
        const categoryNames = book.categories.map(category => category.bookCategoName).join(' ');
        const langageName = book.bookLanguage;
        const searchableText = `${authorName} ${publisherName} ${book.bookTitle} ${categoryNames} ${langageName}`.toLowerCase();
        
        const normalizedSearchableText = searchableText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normalizedTerm = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        return normalizedSearchableText.includes(normalizedTerm) ? book : null;
      }).filter((book): book is Book => book !== null) // Filter out null values
    );
  }
  

  search(term: string) {
    this.searchTerms.next(term);
  }
}
