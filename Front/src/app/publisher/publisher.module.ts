import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublisherListComponent } from './publisherList/publisherList.component';
import { PublisherService } from './publisher.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AddPublisherComponent } from './addPublisher/addPublisher.component';
import { authGuard } from '../auth/auth.guard';

const publisherRoute: Routes = [
  { path: "publishers", component: PublisherListComponent },
  { path: "addpublisher", component: AddPublisherComponent, canActivate: [authGuard], data: { requiredPermission: "Admin" || "Super Admin" } },
];

@NgModule({
  declarations: [
    PublisherListComponent,
    AddPublisherComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(publisherRoute),
  ],
  providers: [PublisherService]
})
export class PublisherModule { }
