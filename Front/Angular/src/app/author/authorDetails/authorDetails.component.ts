import { Component, Input, type OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorService } from '../author.service';
import { Author } from '../author';

@Component({
  selector: 'app-author-details',
  templateUrl: './authorDetails.component.html',
  styleUrl: './authorDetails.component.css',
})
export class AuthorDetailsComponent implements OnInit {
  

  ngOnInit(): void {
    
  }

}
