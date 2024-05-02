import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-publisher-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './publisherList.component.html',
  styleUrl: './publisherList.component.css',
})
export class PublisherListComponent implements OnInit {

  ngOnInit(): void { }

}
