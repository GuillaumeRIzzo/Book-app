import { Component, type OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PublisherService } from '../publisher.service';
import { Publisher } from '../publisher';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-publisher',
  templateUrl: './addPublisher.component.html',
  styleUrl: './addPublisher.component.css',
})
export class AddPublisherComponent implements OnInit {
  publisher: Publisher;

  async ngOnInit() {
    this.publisher = new Publisher();
  }
}
