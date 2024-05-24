import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublisherListComponent } from './publisherList/publisherList.component';
import { PublisherService } from './publisher.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AddPublisherComponent } from './addPublisher/addPublisher.component';
import { authGuard } from '../auth/auth.guard';
import { EditPublisherComponent } from './editPublisher/editPublisher.component';
import { PublisherDetailsComponent } from './publisherDetails/publisherDetails.component';
import { PublisherFormComponent } from './publisherForm/publisherForm.component';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const publisherRoute: Routes = [
  { path: "edit/publisher/:id", component: EditPublisherComponent, canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "publisher/add", component: AddPublisherComponent, canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "publishers", component: PublisherListComponent },
  { path: "publisher/:id", component: PublisherDetailsComponent },
];

@NgModule({
  declarations: [
    PublisherListComponent,
    PublisherFormComponent,
    AddPublisherComponent,
    EditPublisherComponent,
    PublisherDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    RouterModule.forChild(publisherRoute),
  ],
  providers: [PublisherService]
})
export class PublisherModule { }
