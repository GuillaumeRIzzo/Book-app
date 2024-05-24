import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input, EventEmitter, WritableSignal, computed } from '@angular/core';
import { SearchService } from '../search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-overlay',
  templateUrl: './searchOverlay.component.html',
  styleUrls: ['./searchOverlay.component.css'],
})
export class SearchOverlayComponent implements OnInit, AfterViewInit {
  @ViewChild('searchResults') searchResultsOverlay: ElementRef;
  @Input() customKeydown: EventEmitter<KeyboardEvent>;
  @Input() searchBox: HTMLInputElement;

  searchTerm: WritableSignal<string>;
  focusedIndex: number = -1;

  constructor(private searchService: SearchService, private router: Router) { }

  ngOnInit(): void {
    this.searchTerm = this.searchService.searchTerms;
  }

  ngAfterViewInit() {
    if (this.customKeydown) {
      this.customKeydown.subscribe((event: KeyboardEvent) => {
        this.handleKeyboardEvents(event);
      });
    }
  }

  handleKeyboardEvents(event: KeyboardEvent): void {
    const resultsAll = this.searchResultsOverlay?.nativeElement?.querySelectorAll('mat-list-item');
    const resultsOverlay = this.searchResultsOverlay?.nativeElement?.querySelectorAll('.search-result-item');

    if (!resultsAll || resultsAll.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex + 1) % (resultsAll.length + 1);
        if (this.focusedIndex === resultsAll.length) {
          (this.searchBox) && this.searchBox.focus();
        } else {
          resultsAll[this.focusedIndex].focus();
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex - 1 + resultsAll.length + 1) % (resultsAll.length + 1);
        if (this.focusedIndex === resultsAll.length) {
          (this.searchBox) && this.searchBox.focus();
        } else {
          resultsAll[this.focusedIndex].focus();
        }
        break;
      case 'Enter':
        if (this.focusedIndex >= 0 && this.focusedIndex < resultsAll.length) {
          if (this.focusedIndex <= this.recentSearches().length - 1) {
            this.searchTerm.set(resultsOverlay[this.focusedIndex].querySelector('h3').innerText.trim());
          }
          this.performSearch(this.searchTerm());
          resultsAll[this.focusedIndex].click();
        }
        break;
      case 'Delete':
        if (this.focusedIndex >= 0 && this.focusedIndex < resultsOverlay.length) {
          const deleteButton = resultsOverlay[this.focusedIndex].querySelector('button[matListItemMeta]');
          if (deleteButton) {
            deleteButton.click();
          }
        }
        break;
      case 'Backspace' :
        (this.searchBox) && this.searchBox.focus();
        this.focusedIndex = -1;
    }
  }

  recentSearches = computed(() => this.searchService.recentSearches().slice(0, 5));

  trackBySearch(index: number, search: string): string {
    return search;
  }

  performSearch(term: string) {
    this.searchService.search(term);
  }

  deleteRecentSearches(searchTerm: string) {
    this.searchService.deleteRecentSearches(searchTerm);
  }
}
