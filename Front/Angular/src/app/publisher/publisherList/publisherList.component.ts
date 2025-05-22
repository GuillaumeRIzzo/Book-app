import { Component, type OnInit } from '@angular/core';
import { Publisher } from '../publisher';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/authService.service';
import { PublisherService } from '../publisher.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

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
    "Actions"
  ];
  displayedColumn: string[] = [
    "publisherName",
  ];
  publisherList: Publisher[];

  constructor(
    private router: Router,
    private authServie: AuthService,
    private publisherService: PublisherService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.publisherService.getPublishers()
      .then(data => this.publisherList = data);
    // this.log = this.authServie.isLog();
    this.right = this.authServie.hasPermission(["Super Admin", "Admin"]);
  }

  goToPublisher(publisher: Publisher) {
    this.router.navigate(["publisher/", publisher.publisherId]);
   }
   
  modifyPublisher(publisher: Publisher) {
    this.router.navigate(["edit/publisher/", publisher.publisherId]);
   }

   openDialog(publisher: Publisher): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: 'Suppression d\'éditeur', message: `Voulez vous vraiment supprimer l'éditeur ${publisher.publisherName} ?` }
    });
  
    dialogRef.componentInstance.actionClicked.subscribe(() => {
      this.deletPublisher(publisher);
      this.dialog.closeAll();
    });
  }

  async deletPublisher(publisher: Publisher) {
    const result = await this.publisherService.deletePublisher(publisher);

    if (result == 204) {
      this.publisherList = await this.publisherService.getPublishers();
    }
  }
}
