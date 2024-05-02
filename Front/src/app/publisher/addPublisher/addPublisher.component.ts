import { Component, type OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PublisherService } from '../publisher.service';
import { Publisher } from '../publisher';

@Component({
  selector: 'app-add-publisher',
  templateUrl: './addPublisher.component.html',
  styleUrl: './addPublisher.component.css',
})
export class AddPublisherComponent implements OnInit {

  publisherForm = new FormGroup({
    publisherId: new FormControl(0, { nonNullable: true }),
    publisherName: new FormControl('', { nonNullable: true }),
  });

	constructor(private publisherService: PublisherService) { }
	
	ngOnInit(): void {
	}

	async onSubmit() {
    const result = await this.publisherService.AddPublisher((this.publisherForm.value as Publisher))
  }
}
