import { Component, type OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BookCategoryService } from '../bookCategory.service';
import { BookCategory } from '../bookCategory';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addbookcategory',
  templateUrl: './addbookcategory.component.html',
  styleUrl: './addbookcategory.component.css',
})
export class AddbookcategoryComponent implements OnInit {
  catego: BookCategory;

  ngOnInit(): void {
    this.catego = new BookCategory();
  }
}

