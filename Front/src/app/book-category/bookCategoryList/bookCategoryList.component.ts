import { Component, type OnInit } from '@angular/core';
import { AuthService } from '../../auth/authService.service';
import { BookCategory } from '../bookCategory';
import { BookCategoryService } from '../bookCategory.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-book-category-list',
  templateUrl: './bookCategoryList.component.html',
  styleUrl: './bookCategoryList.component.css',
})
export class BookCategoryListComponent implements OnInit {

  right: boolean;
  displayedColumns: string[] = [
    "bookCategoId",
    "bookCategoName",
    "bookCategoDescription",
    "Actions"
  ];
  displayedColumn: string[] = [
    "bookCategoName",
    "bookCategoDescription"
  ];
  bookCategoryList: BookCategory[];

  constructor(
    private router: Router,
    private authServie: AuthService,
    private bookCategoService: BookCategoryService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.bookCategoService.getBookCategories()
      .then(data => this.bookCategoryList = data);
    this.right = this.authServie.hasPermission(["Super Admin", "Admin"]);
  }

  goToBookCategory(bookCategory: BookCategory) {
    this.router.navigate(["bookcategory/", bookCategory.bookCategoId]);
   }

   modifyBookCategory(bookCategory: BookCategory) {
    this.router.navigate(["edit/bookcategory/", bookCategory.bookCategoId]);
   }

   openDialog(bookCategory: BookCategory): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: 'Suppression d\'utilisateur', message: `Voulez vous vraiment supprimer l'utilisateur ${bookCategory.bookCategoName} ?` }
    });
  
    dialogRef.componentInstance.actionClicked.subscribe(() => {
      this.deletBookCategory(bookCategory);
    });
  }

  async deletBookCategory(bookCategory: BookCategory) {
    const result = await this.bookCategoService.deleteBookCategory(bookCategory);

    if (result == 204) {
      this.bookCategoryList = await this.bookCategoService.getBookCategories();
    }
  }

}
