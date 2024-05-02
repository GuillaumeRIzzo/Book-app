import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { Book } from '../book';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { Publisher } from '../../publisher/publisher';
import { PublisherService } from '../../publisher/publisher.service';
import { AuthorService } from '../../author/author.service';
import { Author } from '../../author/author';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


@Component({
  selector: 'app-add-book',
  templateUrl: './addBook.component.html',
  styleUrl: './addBook.component.css',
})
export class AddBookComponent implements OnInit {

  bookForm = new FormGroup({
    bookId: new FormControl(0, [Validators.required]),
    bookTitle: new FormControl('', [Validators.required]),
    bookDescription: new FormControl('', [Validators.required]),
    bookPublishDate: new FormControl(new Date, [Validators.required]),
    bookPageCount: new FormControl(0, [Validators.required]),
    bookAverageRating: new FormControl(0, [Validators.required]),
    bookRatingCount: new FormControl(0, [Validators.required]),
    bookImageLink: new FormControl('', [Validators.required]),
    bookLanguage: new FormControl('', [Validators.required]),
    publisherId: new FormControl(0, [Validators.required]),
    authorId: new FormControl(0, [Validators.required]),
    read: new FormControl(false, [Validators.required]),
    inList: new FormControl(false, [Validators.required]),
  });
  publisherName = new FormControl<string | Publisher>("", [Validators.required]);
  authorName = new FormControl<string | Author>("", [Validators.required]);
  
  publishers: Publisher[];
  authors: Author[];

  filteredPublisherOptions: Observable<Publisher[]>;
  filteredAuthorOptions: Observable<Author[]>;

  constructor(
    private bookService: BookService,
    private publisherService: PublisherService,
    private authorService: AuthorService,
  ) { }

  async ngOnInit() {
    this.publishers = await this.publisherService.getPublishers();
    if (this.publisherName instanceof FormControl) {
      this.filteredPublisherOptions = this.publisherName.valueChanges.pipe(
        startWith(''),
        map(value => {
          if (typeof value === 'string') {
            return this._filterPublisher(value); 
          } else {
            return this.publishers.slice();
          }
        }),
      );
    }
    this.authors = await this.authorService.getAuthors();
    if (this.authorName instanceof FormControl) {
      this.filteredAuthorOptions = this.authorName.valueChanges.pipe(
        startWith(''),
        map(value => {
          if (typeof value === 'string') {
            return this._filterAuthor(value); 
          } else {
            return this.authors.slice();
          }
        }),
      );
    }
  }

  trackByFnPublisher(index: number, publisher: Publisher) {
    return publisher.publisherId;
  }
  
  displayFnPublisher(publisher: Publisher): string {
    return publisher && publisher.publisherName ? publisher.publisherName : '';
  }
  
  private _filterPublisher(name: string): Publisher[] {
    const filterValue = name.toLowerCase();

    return this.publishers.filter(publisher => publisher.publisherName.toLowerCase().includes(filterValue));
  }

  trackByFnAuthor(index: number, author: Author): number {
    return author.authorId;
  }
  
  displayFnAuthor(author: Author): string {
    return author && author.authorName ? author.authorName : '';
  }
  
  private _filterAuthor(name: string): Author[] {
    const filterValue = name.toLowerCase();

    return this.authors.filter(author => author.authorName.toLowerCase().includes(filterValue));
  }

  onPublisherSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedPublisher: Publisher = event.option.value;
    this.bookForm.patchValue({
      publisherId: selectedPublisher.publisherId
    });
  }
  
  onAuthorSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedAuthor: Author = event.option.value;
    this.bookForm.patchValue({
      authorId: selectedAuthor.authorId
    });
  }

  async onSubmit() {
    const result = await this.bookService.AddBook((this.bookForm.value as Book))
    // alert(result.status);
  }
}
