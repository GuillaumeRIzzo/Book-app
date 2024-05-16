import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { UserService } from './user.service';
import { InscriptionComponent } from '../auth/inscription/inscription.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthService } from '../auth/authService.service';
import { UserListComponent } from './userList/userList.component';
import { authGuard } from '../auth/auth.guard';
import { UserEditComponent } from './userEdit/userEdit.component';
import { UserFormComponent } from './userForm/userForm.component';

const userRoute: Routes = [
  { path: "singin", component: InscriptionComponent },
  { path: "login", component: LoginComponent },
  { path: "users", component: UserListComponent,  canActivate: [authGuard], data: { requiredPermission: ["Super Admin", "Admin"] } },
  { path: "user/:id", component: UserEditComponent,  canActivateChild: [authGuard]},
];

@NgModule({
  declarations: [
    UserFormComponent,
    InscriptionComponent,
    LoginComponent,
    UserListComponent,
    UserEditComponent
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