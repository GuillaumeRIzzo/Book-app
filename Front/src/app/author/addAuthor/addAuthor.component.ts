import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../author.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Author } from '../author';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-author',
  templateUrl: './addAuthor.component.html',
  styleUrl: './addAuthor.component.css',
})
export class AddAuthorComponent implements OnInit {
  author: Author
  
  ngOnInit(): void {
    this.author = new Author()
  }
}
