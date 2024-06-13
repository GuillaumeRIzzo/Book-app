import { Component, type OnInit, Input } from '@angular/core';
import { Publisher } from '../publisher';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PublisherService } from '../publisher.service';

@Component({
  selector: 'app-publisher-form',
  templateUrl: './publisherForm.component.html',
  styleUrl: './publisherForm.component.css',
})
export class PublisherFormComponent implements OnInit {
  @Input() publisher: Publisher;
  isAddForm: boolean;

  publisherForm = new FormGroup({
    publisherId: new FormControl(0, { nonNullable: true }),
    publisherName: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private router: Router,
    private publisherService: PublisherService) { }

  ngOnInit(): void {
    this.isAddForm = this.router.url.includes('add');
    if (!this.isAddForm) {
      this.publisherForm.setValue({
        publisherId: this.publisher.publisherId,
        publisherName: this.publisher.publisherName
      })
    }
  }

  async onSubmit() {
    if (this.isAddForm) {
      const result = await this.publisherService.addPublisher((this.publisherForm.value as Publisher))

      if (result == 201) {
        this.router.navigate(["publishers"]);
      }

    } else {
      const result = await this.publisherService.updatePublisher((this.publisherForm.value as Publisher))

      if (result == 204) {
        this.router.navigate(["publishers", this.publisher.publisherId]);
      }
    }
  }
}
