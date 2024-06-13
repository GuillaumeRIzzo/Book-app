import { Component, Input, type OnInit } from '@angular/core';
import { BookCategory } from '../bookCategory';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BookCategoryService } from '../bookCategory.service';

@Component({
  selector: 'app-book-category-form',
  templateUrl: './bookCategoryForm.component.html',
  styleUrl: './bookCategoryForm.component.css',
})
export class BookCategoryFormComponent implements OnInit {
  @Input() categos: BookCategory;
  isAddForm: boolean;

  bookCategoForm = new FormGroup({
    bookCategoId: new FormControl(0, { nonNullable: true }),
    bookCategoName: new FormControl('', { nonNullable: true }),
    bookCategoDescription: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private router: Router,
    private bookCategoryService: BookCategoryService
  ) { }

  ngOnInit(): void {
    this.isAddForm = this.router.url.includes('add');
    if (!this.isAddForm) {
      this.bookCategoForm.setValue({
        bookCategoId: this.categos.bookCategoId,
        bookCategoName: this.categos.bookCategoName,
        bookCategoDescription: this.categos.bookCategoDescription
      });
    }
  }

  async onSubmit() {
    const result = await this.bookCategoryService.AddBookCategory((this.bookCategoForm.value as BookCategory));

    if (result == 201) {
      this.router.navigateByUrl("bookscategories");
    }
  }
}
