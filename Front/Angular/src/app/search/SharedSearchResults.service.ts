import { Injectable } from '@angular/core';
import { Book } from '../book/book';

@Injectable({
  providedIn: 'root'
})
export class SharedSearchResultsService {
  private results: Book[] = [];

  setResults(results: Book[]): void {
    this.results = results;
    localStorage.setItem('searchResults', JSON.stringify(results));
  }

  getResults(): Book[] {
    if (this.results.length === 0) {
      const storedResults = localStorage.getItem('searchResults');
      if (storedResults) {
        this.results = JSON.parse(storedResults);
      }
    }
    return this.results;
  }
}
