import { Component, Input, type OnInit } from '@angular/core';
import { Author } from '../author';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-author-form',
  templateUrl: './authorForm.component.html',
  styleUrl: './authorForm.component.css',
})
export class AuthorFormComponent implements OnInit {
  @Input() author: Author;
  isAddForm: boolean;

  authorForm = new FormGroup({
    authorId: new FormControl(0, { nonNullable: true }),
    authorName: new FormControl('', { nonNullable: true }),
  });

	constructor(
    private router: Router,
		private authorService: AuthorService) { }
	
	async ngOnInit() {
    this.isAddForm = this.router.url.includes('add');
    if (!this.isAddForm) {
      this.authorForm.setValue({
        authorId: this.author.authorId,
        authorName: this.author.authorName
      })
    }
	}

	async onSubmit() {
    if (this.isAddForm) {
      const result = await this.authorService.addAuthor((this.authorForm.value as Author));
      
      if (result == 201) {
        this.router.navigateByUrl("authors");
      }
    } else {
      const result = await this.authorService.updateAuthor((this.authorForm.value as Author));
      if (result == 204) {
        this.router.navigate(["author", this.author.authorId]);
      }
    }
  }

}
