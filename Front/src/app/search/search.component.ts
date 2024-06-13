import { Component, OnInit, ViewChild, ElementRef, WritableSignal, HostListener, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchService } from './search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('searchBox') searchBox: ElementRef;
  @Output() customKeydown = new EventEmitter<KeyboardEvent>();

  searchTerms: WritableSignal<string>;
  overlayOpen: WritableSignal<boolean>;
  searchOpen: WritableSignal<boolean>;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvents(event: KeyboardEvent): void {
    if (this.overlayOpen()) {
      this.customKeydown.emit(event);
    }
  }

  constructor(private router: Router, private searchService: SearchService) {}

  ngAfterViewInit() {
    this.searchBox.nativeElement.focus();
  }

  ngOnInit() {
    this.overlayOpen = this.searchService.overlayOpen;
    this.searchOpen = this.searchService.searchOpen;
    this.searchTerms = this.searchService.searchTerms;
  }

  search(term: string) {
    if (!term) return;
    this.searchService.search(term);
  }

  clearSearch() {
    this.searchService.clearSearch();
  }
}
