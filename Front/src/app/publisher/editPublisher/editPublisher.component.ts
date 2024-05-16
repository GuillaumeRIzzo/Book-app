import { Component, type OnInit } from '@angular/core';
import { Publisher } from '../publisher';
import { PublisherService } from '../publisher.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-publisher',
  templateUrl: './editPublisher.component.html',
  styleUrl: './editPublisher.component.css',
})
export class EditPublisherComponent implements OnInit {
  publisher: Publisher | undefined;

  constructor(
    private route: ActivatedRoute,
    private publisherService: PublisherService) { }

  async ngOnInit() {
    const publisherId: string | null = this.route.snapshot.paramMap.get('id');
    if (publisherId) {
      this.publisher = await this.publisherService.getPublisher(+publisherId)
    }
   }

}
