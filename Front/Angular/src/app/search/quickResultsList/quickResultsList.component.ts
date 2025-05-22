import { Component, Input, WritableSignal, type OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { SearchResultsService } from '../searchResults.service';
import { Router } from '@angular/router';
import { Book } from '../../book/book';
import { Author } from '../../author/author';
import { Publisher } from '../../publisher/publisher';

@Component({
  selector: 'app-quick-results-list',
  templateUrl: './quickResultsList.component.html',
  styleUrls: ['./quickResultsList.component.css'],
})
export class QuickResultsListComponent implements OnInit {
  topResults: WritableSignal<Book[]>;
  searchTerm: WritableSignal<string>;
  searchOpen: WritableSignal<boolean>;
  
  constructor(
    private router: Router,
    private searchService: SearchService,
    private resultsService: SearchResultsService) { }
    
  ngOnInit(): void { 
    this.topResults = this.resultsService.quickResults
    this.searchTerm = this.searchService.searchTerms;
    this.searchOpen = this.searchService.searchOpen;
  }

  trackByBook(index: number, book: Book): number {
    return book.bookId;
  }
  
  goToSearch(searchTerm: string) {
    this.router.navigate(["search/", searchTerm]);
    this.searchService.overlayOpen.set(false);
    this.searchOpen.set(false);
  }

  goToBook(bookId: number) {
    this.router.navigate(["book/", bookId]);
    this.searchService.overlayOpen.set(false);
    this.searchOpen.set(false);
  }
}
