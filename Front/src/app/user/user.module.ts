import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { UserService } from './user.service';
import { InscriptionComponent } from '../auth/inscription/inscription.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/authService.service';

const userRoute: Routes = [
  { path: "singin", component: InscriptionComponent },
  { path: "login", component: LoginComponent },
];

@NgModule({
  declarations: [
    InscriptionComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    RouterModule.forChild(userRoute)
  ],
  providers: [UserService, AuthService]
})
export class UserModule { }
