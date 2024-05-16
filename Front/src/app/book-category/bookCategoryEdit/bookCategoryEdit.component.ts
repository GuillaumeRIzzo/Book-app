import { Component, type OnInit } from '@angular/core';
import { BookCategory } from '../bookCategory';
import { ActivatedRoute } from '@angular/router';
import { BookCategoryService } from '../bookCategory.service';

@Component({
  selector: 'app-book-category-edit',
  templateUrl: './bookCategoryEdit.component.html',
  styleUrl: './bookCategoryEdit.component.css',
})
export class BookCategoryEditComponent implements OnInit {
  catego: BookCategory | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private bookCategoryService: BookCategoryService,
  ) {}

  async ngOnInit() { 
    const categoId: string | null = this.route.snapshot.paramMap.get('id');
    if (categoId) {
      this.catego = await this.bookCategoryService.getBookCategory(+categoId);
    }
   }

}
