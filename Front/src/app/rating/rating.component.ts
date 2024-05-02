import { Component, EventEmitter, Output, type OnInit } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent implements OnInit {

  ngOnInit(): void { }
  stars: number[] = [1, 2, 3, 4, 5];
  selected: number = 0;
  @Output() rated = new EventEmitter<number>();

  rate(rating: number) {
    this.selected = rating;
    this.rated.emit(rating); // Emit event when rating is changed
  }
}