import { Component, type OnInit } from '@angular/core';
import { Author } from '../author';
import { ActivatedRoute } from '@angular/router';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-edit-author',
  templateUrl: './editAuthor.component.html',
  styleUrl: './editAuthor.component.css',
})
export class EditAuthorComponent implements OnInit {
  author: Author | undefined;

  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
  ) {}

  async ngOnInit() { 
    const authorId: string | null = this.route.snapshot.paramMap.get('id');
    if (authorId) {
      this.author = await this.authorService.getAuthor(+authorId);
    }
   }
}
