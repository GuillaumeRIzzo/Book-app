import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../author.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Author } from '../author';

@Component({
	selector: 'app-add-author',
	templateUrl: './addAuthor.component.html',
	styleUrl: './addAuthor.component.css',
})
export class AddAuthorComponent implements OnInit {

  authorForm = new FormGroup({
    authorId: new FormControl(0, { nonNullable: true }),
    authorName: new FormControl('', { nonNullable: true }),
  });

	constructor(private authorService: AuthorService) { }
	
	ngOnInit(): void {
	}

	async onSubmit() {
    const result = await this.authorService.AddAuthor((this.authorForm.value as Author))
  }
}
