import { Injectable, signal } from '@angular/core';
import { Book } from '../book/book';
import { Author } from '../author/author';
import { Publisher } from '../publisher/publisher';
import { SharedSearchResultsService } from './SharedSearchResults.service';

@Injectable({
  providedIn: 'root'
})
export class SearchResultsService {
  quickResults = signal<Book[]>([]);

  books: Book[];
  authors: Author[];
  publishers: Publisher[];

  constructor(private sharedSearchResultsService: SharedSearchResultsService){}  // Inject the shared service) { }

  setData(books: Book[], authors: Author[], publishers: Publisher[]) {
    this.books = books;
    this.authors = authors;
    this.publishers = publishers;
  }

  async getQuickResults(searchTerm: string) {
    if (!searchTerm) {
      this.quickResults.set([]);
      return;
    }

    if (!this.books || !this.authors || !this.publishers) {
      this.quickResults.set([]);
      return;
    }

    const searchTermFroQuery = searchTerm.toLocaleLowerCase();

    const response = this.books.map(book => {
      const authorName = this.authors.find(a => a.authorId === book.authorId)?.authorName || '';
      const publisherName = this.publishers.find(p => p.publisherId === book.publisherId)?.publisherName || '';
      const categoryNames = book.categories.map(category => category.bookCategoName).join(' ');
      const languageName = book.bookLanguage;
      const searchableText = `${authorName} ${publisherName} ${book.bookTitle} ${categoryNames} ${languageName}`.toLowerCase();

      const normalizedSearchableText = searchableText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const normalizedTerm = searchTermFroQuery.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      return normalizedSearchableText.includes(normalizedTerm) ? book : null;
    }).filter((book): book is Book => book !== null);

    this.quickResults.set(response);
    this.sharedSearchResultsService.setResults(response);
  }

}
