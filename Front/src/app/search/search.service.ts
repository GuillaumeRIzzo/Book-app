import { Injectable, effect, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { SearchResultsService } from './searchResults.service';
import { Publisher } from '../publisher/publisher';
import { Author } from '../author/author';
import { Book } from '../book/book';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  overlayOpen = signal(false);
  searchOpen = signal(false);
  recentSearches = signal<string[]>(JSON.parse(window.localStorage.getItem("recentSearches") ?? '[]'));
  searchTerms = signal<string>('');
  termSearch = signal<string>('');

  quickResults = signal<Book[]>([]);

  constructor(
    private resultsService: SearchResultsService
  ) {
    this.initializeSearch();
  }

  initializeSearch() {  
    toObservable(this.searchTerms)
      .pipe(debounceTime(500))
      .subscribe((term) => {
        this.resultsService.getQuickResults(term);
      });
  }

  search(term: string) {
    this.searchTerms.set(term);
    this.addToRecentSearches(term);
  }

  addToRecentSearches(searchTerm: string) {
    const lowerCaseTerm = searchTerm.toLocaleLowerCase();
    this.recentSearches.set([
      lowerCaseTerm,
      ...this.recentSearches().filter((s) => s !== lowerCaseTerm)
    ]);
  }

  deleteRecentSearches(searchTerm: string) {
    this.recentSearches.set(this.recentSearches().filter(s => s !== searchTerm));
  }

  clearSearch() {
    this.searchTerms.set('');
    this.overlayOpen.set(true);
  }

  saveLocalStorage = effect(() => {
    window.localStorage.setItem(
      'recentSearches',
      JSON.stringify(this.recentSearches())
    );
  });
}

// Function to get the first recent search from localStorage
function getFirstRecentSearch(): string | null {
  const recentSearches = window.localStorage.getItem("recentSearches");
  if (recentSearches) {
    try {
      const recentSearchesArray = JSON.parse(recentSearches);
      if (Array.isArray(recentSearchesArray) && recentSearchesArray.length > 0) {
        return recentSearchesArray[0];
      }
    } catch (e) {
      console.error("Error parsing recent searches from localStorage:", e);
    }
  }
  return null;
}
