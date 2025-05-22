import { Component, Input, type OnInit } from '@angular/core';
import { SearchResultsService } from '../searchResults.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Book } from '../../book/book';
import { Author } from '../../author/author';
import { Publisher } from '../../publisher/publisher';
import { SharedDataService } from '../../shared-data.service';
import { BookService } from '../../book/book.service';
import { AuthorService } from '../../author/author.service';
import { PublisherService } from '../../publisher/publisher.service';
import { SearchService } from '../search.service';
import { SharedSearchResultsService } from '../SharedSearchResults.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './searchResults.component.html',
  styleUrls: ['./searchResults.component.css'],
})
export class SearchResultsComponent implements OnInit {
  query: string;
  result: Book[];

  books: Book[];
  authors: Author[];
  publishers: Publisher[];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private resultsService: SearchResultsService,
    private sharedDataService: SharedDataService,
    private bookService: BookService,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private sharedSearchResultsService: SharedSearchResultsService
  ) { 
    this.searchService.initializeSearch();
  }

  async ngOnInit(){ 
    this.route.params.subscribe(async (params: Params) => {
      this.query = params['query'];

      this.searchService.searchTerms.set(this.query);
      Promise.all([
        this.bookService.getBooks(),
        this.authorService.getAuthors(),
        this.publisherService.getPublishers()
      ]).then(([books, authors, publishers]) => {
        this.books = books;
        this.authors = authors;
        this.publishers = publishers;
        this.resultsService.setData(books, authors, publishers);
      });
      // this.resultsService.getQuickResults(this.query);
      this.result = this.sharedSearchResultsService.getResults();
    });
  }
}
