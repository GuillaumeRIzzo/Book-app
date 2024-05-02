import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../author.service';
import { Author } from '../author';
import { AuthService } from '../../auth/authService.service';

@Component({
  selector: 'app-authors-list',
  templateUrl: './authorsList.component.html',
  styleUrl: './authorsList.component.css',
})
export class AuthorsListComponent implements OnInit {
  right: boolean;
  displayedColumns: string[] = [
    "authorId",
    "authorName",
  ];
  dataSource: Author[];

  constructor(
    private authServie: AuthService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.authorService.getAuthors()
      .then(data => this.dataSource = data);
    // this.log = this.authServie.isLog();
    this.right = this.authServie.hasPermission("Admin" || "Super Admin");
  }

}
