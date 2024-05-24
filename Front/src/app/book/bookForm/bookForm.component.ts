import { Component, ElementRef, Input, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

import { Publisher } from '../../publisher/publisher';
import { Author } from '../../author/author';
import { BookCategory } from '../../book-category/bookCategory';
import { Router } from '@angular/router';
import { BookService } from '../book.service';
import { PublisherService } from '../../publisher/publisher.service';
import { AuthorService } from '../../author/author.service';
import { BookCategoryService } from '../../book-category/bookCategory.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Book } from '../book';

@Component({
  selector: 'app-book-form',
  templateUrl: './bookForm.component.html',
  styleUrls: ['./bookForm.component.css'],
})
export class BookFormComponent implements OnInit {
  @Input() book: Book;
  @Input() author: Author;
  @Input() publisher: Publisher;
  isAddForm: boolean;

  @ViewChild('stepper') stepper: MatStepper;
  stepperOrientation: Observable<StepperOrientation>;

  bookForm = new FormGroup({
    bookId: new FormControl(0, [Validators.required]),
    bookTitle: new FormControl('', [Validators.required]),
    bookDescription: new FormControl('', [Validators.required]),
    bookPublishDate: new FormControl(new Date(), [Validators.required]),
    bookPageCount: new FormControl(0, [Validators.required]),
    bookAverageRating: new FormControl(0, [Validators.required]),
    bookRatingCount: new FormControl(0, [Validators.required]),
    bookImageLink: new FormControl('', [Validators.required]),
    bookLanguage: new FormControl('', [Validators.required]),
    publisherId: new FormControl(0, [Validators.required]),
    authorId: new FormControl(0, [Validators.required]),
    read: new FormControl(false, [Validators.required]),
    inList: new FormControl(false, [Validators.required]),
    categories: new FormArray([], [Validators.required])
  });

  publisherName = new FormControl<string | Publisher>("", [Validators.required]);
  authorName = new FormControl<string | Author>("", [Validators.required]);
  bookCategoName = new FormControl<string | BookCategory>("", [Validators.required]);

  publishers: Publisher[];
  authors: Author[];

  categos: BookCategory[] = [];
  listCategos: BookCategory[];

  filteredPublisherOptions: Observable<Publisher[]>;
  filteredAuthorOptions: Observable<Author[]>;
  filteredCategosOptions: Observable<BookCategory[]>;

  @ViewChild('categoInput') categoInput: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private router: Router,
    private bookService: BookService,
    private publisherService: PublisherService,
    private authorService: AuthorService,
    private bookCategoryService: BookCategoryService,
    breakpointObserver: BreakpointObserver,
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  async ngOnInit() {
    this.isAddForm = this.router.url.includes('add');
    if (!this.isAddForm) {
      this.bookForm.setValue({
        bookId: this.book.bookId,
        bookTitle: this.book.bookTitle,
        bookDescription: this.book.bookDescription,
        bookPublishDate: this.book.bookPublishDate,
        bookPageCount: this.book.bookPageCount,
        bookAverageRating: this.book.bookAverageRating,
        bookRatingCount: this.book.bookRatingCount,
        bookImageLink: this.book.bookImageLink,
        bookLanguage: this.book.bookLanguage,
        publisherId: this.book.publisherId,
        authorId: this.book.authorId,
        read: this.book.read,
        inList: this.book.inList,
        categories: []
      });
      const categoriesArray = this.bookForm.get('categories') as FormArray;
      this.book.categories.forEach(category => {
        const categoryFormGroup = new FormGroup({
          bookCategoId: new FormControl(category.bookCategoId, [Validators.required]),
          bookCategoName: new FormControl(category.bookCategoName, [Validators.required]),
          bookCategoDescription: new FormControl(category.bookCategoDescription, [Validators.required])
        });
        categoriesArray.push(categoryFormGroup);
      });
      this.categos = this.book.categories;
      this.authorName.setValue(this.author);
      this.publisherName.setValue(this.publisher);
    }
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
    this.filteredAuthorOptions = this.authorName.valueChanges.pipe(
      startWith(''),
      map(value => {
        if (typeof value === "string") {
          return this._filterAuthor(value);
        } else {
          return this.authors.slice();
        }
      })
    );

    this.listCategos = await this.bookCategoryService.getBookCategories();
    this.filteredCategosOptions = this.bookCategoName.valueChanges.pipe(
      startWith(''),
      map(catego => {
        if (typeof catego === "string") {
          return this._filterCatego(catego);
        } else {
          return this.listCategos.slice();
        }
      })
    );
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

  private _filterCatego(value: string): BookCategory[] {
    const filterValue = value.toLowerCase();
    return this.listCategos.filter(catego => catego.bookCategoName.toLowerCase().includes(filterValue));
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

  private addCategory(category: BookCategory): void {
    if (!this.categos.some(c => c.bookCategoId === category.bookCategoId)) {
      this.categos.push(category);
      const categories = this.bookForm.get('categories') as FormArray;
      categories.push(new FormGroup({
        bookCategoId: new FormControl(category.bookCategoId, [Validators.required]),
        bookCategoName: new FormControl<string | BookCategory>(category.bookCategoName, [Validators.required]),
        bookCategoDescription: new FormControl(category.bookCategoDescription, [Validators.required])
      }));
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    const category = this.listCategos.find(c => c.bookCategoName.toLowerCase() === value.toLowerCase());

    if (category) {
      this.addCategory(category);
    }

    event.chipInput!.clear();
    this.bookCategoName.setValue(null);
  }

  remove(catego: BookCategory): void {
    const index = this.categos.indexOf(catego);

    if (index >= 0) {
      this.categos.splice(index, 1);
      const categories = this.bookForm.get('categories') as FormArray;
      categories.removeAt(index);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const category = event.option.value;
    this.addCategory(category);
    this.categoInput.nativeElement.value = '';
    this.bookCategoName.setValue(null);
  }

  get authorNameValue() {
    let name = this.authorName.value as Author;
    return name.authorName;
  }

  get publisherNameValue() {
    let name = this.publisherName.value as Publisher;
    return name.publisherName;
  }

  async onSubmit() {
    if (this.isAddForm) {
      const result = await this.bookService.addBook(this.bookForm.value as Book)
      if (result == 201) {
        this.router.navigateByUrl("books");
      }
    } else {
      const result = await this.bookService.updateBook(this.bookForm.value as Book)
      if (result == 204) {
        this.router.navigate(["book/", this.book.bookId]);
      }
    }
  }
}
