import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../author.service';
import { Author } from '../author';
import { AuthService } from '../../auth/authService.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

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
    "Actions"
  ];
  displayedColumn: string[] = [
    "authorName",
  ];
  authorList: Author[];

  constructor(
    private router: Router,
    private authServie: AuthService,
    private authorService: AuthorService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.authorService.getAuthors()
      .then(data => this.authorList = data);
    this.right = this.authServie.hasPermission(["Super Admin", "Admin"]);
  }

  goToAuthor(author: Author) {
    this.router.navigate(["author/", author.authorId]);
   }

  modifyAuthor(author: Author) {
    this.router.navigate(["edit/author/", author.authorId]);
   }

   openDialog(author: Author): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: 'Suppression d\'auteur', message: `Voulez vous vraiment supprimer l'utilisateur ${author.authorName} ?` }
    });
  
    dialogRef.componentInstance.actionClicked.subscribe(() => {
      this.deletAuthor(author);
    });
  }

  async deletAuthor(author: Author) {
    const result = await this.authorService.deleteAuthor(author);

    if (result == 204) {
      this.authorList = await this.authorService.getAuthors();
    }
  }

}
