import { Component, type OnInit } from '@angular/core';
import { Publisher } from '../publisher';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/authService.service';
import { PublisherService } from '../publisher.service';

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisherList.component.html',
  styleUrl: './publisherList.component.css',
})
export class PublisherListComponent implements OnInit {
  right: boolean;
  displayedColumns: string[] = [
    "publisherId",
    "publisherName",
  ];
  dataSource: Publisher[];

  constructor(
    private authServie: AuthService,
    private publisherService: PublisherService
  ) { }

  ngOnInit(): void {
    this.publisherService.getPublishers()
      .then(data => this.dataSource = data);
    // this.log = this.authServie.isLog();
    this.right = this.authServie.hasPermission("Admin" || "Super Admin");
  }
}
