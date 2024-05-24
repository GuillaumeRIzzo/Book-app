import { Component, ViewChild, ElementRef, WritableSignal, HostListener, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthService } from '../auth/authService.service';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { SearchService } from '../search/search.service';
import { SharedDataService } from '../shared-data.service';
import { Book } from '../book/book';
import { Author } from '../author/author';
import { Publisher } from '../publisher/publisher';
import { SearchResultsService } from '../search/searchResults.service';

@Component({
  selector: 'app-navabar',
  templateUrl: './navabar.component.html',
  styleUrls: ['./navabar.component.css'],
  animations: [
    trigger('searchBarAnimation', [
      state('closed', style({
        width: '0px',
        padding: '0px',
        opacity: 0
      })),
      state('open', style({
        width: '40vw',
        paddingTop: '10px',
        opacity: 1
      })),
      transition('closed => open', [
        animate('300ms ease-in-out')
      ]),
      transition('open => closed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class NavabarComponent implements OnInit {
  log: boolean;
  right: boolean;
  login: string;
  userId: string;
  timedOutCloser: any;

  menuList = [
    {
      label: 'Livres',
      menu: 'booksMenu',
      alwaysVisible: false,
      items: [
        // { label: 'Liste des livres', link: 'books' },
        { label: 'Ajout', link: '/book/add', condition: 'right' },
      ],
    },
    {
      label: 'Catégories',
      menu: 'categosMenu',
      alwaysVisible: true,
      items: [
        { label: 'Liste des Catégories', link: 'bookscategories' },
        { label: 'Ajout', link: '/bookcategory/add', condition: 'right' },
      ],
    },
    {
      label: 'Auteurs',
      menu: 'authorsMenu',
      alwaysVisible: true,
      items: [
        { label: 'Liste des auteurs', link: 'authors' },
        { label: 'Ajout', link: '/author/add', condition: 'right' },
      ],
    },
    {
      label: 'Éditeurs',
      menu: 'publishersMenu',
      alwaysVisible: true,
      items: [
        { label: 'Liste des éditeurs', link: 'publishers' },
        { label: 'Ajout', link: '/publisher/add', condition: 'right' },
      ],
    },
  ];

  books: Book[];
  authors: Author[];
  publishers: Publisher[];

  searchOpen: WritableSignal<boolean>;
  overlayOpen: WritableSignal<boolean>;

  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  @ViewChild('searchButton', { static: true }) searchButton: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleEscape(event: KeyboardEvent): void {
    if (event.key == 'Escape') {
      this.closeSearch();
      this.overlayOpen.set(false);
      this.searchService.searchTerms.set('');
    }
    
    if (event.ctrlKey && (event.key === 'f' || event.key === "F")) {
      event.preventDefault();
      this.toggleSearch();
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private searchService: SearchService,
    private resultsService: SearchResultsService,
    private sharedDataService: SharedDataService
  ) {}

  async ngOnInit(){
    this.authService.log$.subscribe((log) => {
      this.log = log;
      this.right = this.authService.hasPermission(['Super Admin', 'Admin']);
      this.login = localStorage.getItem('login') || '';
      this.userId = localStorage.getItem('id') || '';
    });
    this.overlayOpen = this.searchService.overlayOpen;
    this.searchOpen = this.searchService.searchOpen;
    await this.sharedDataService.loadData();
    this.books = this.sharedDataService.getBooks();
    this.authors = this.sharedDataService.getAuthors();
    this.publishers = this.sharedDataService.getPublishers();
    this.resultsService.setData(this.books, this.authors, this.publishers);
  }

  mouseEnter(trigger: { openMenu: () => void }) {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  mouseLeave(trigger: { closeMenu: () => void }) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 15);
  }

  toggleSearch() {
    this.searchOpen.set(true);
    setTimeout(() => {
      this.overlayOpen.set(true);
    }, 100); // Delay to ensure overlay opens before animation starts
  }

  closeSearch() {
    this.overlayOpen.set(false);
    setTimeout(() => {
      this.searchOpen.set(false);
    }, 0); // Delay to ensure animation completes before closing overlay
  }

  logout() {
    this.authService.setToken('');
    this.authService.setLog();
    this.router.navigate(['/']);
  }
}
