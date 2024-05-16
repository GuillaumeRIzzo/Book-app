import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/authService.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './userList.component.html',
  styleUrl: './userList.component.css',
})
export class UserListComponent implements OnInit {
  userList: User[];
  sa: boolean;

  displayedColumns: string[] = [
    "userId",
    "userFirstname",
    "userLastname",
    "userLogin",
    "userEmail",
    "userRight",
    "Actions"
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog
  ) { } 

  async ngOnInit() {
    this.userList = await this.userService.getUsers();
    this.sa = this.authService.hasPermission(["Super Admin"]);
   }

   goToUser(user: User) {
    this.router.navigate(["user/", user.userId]);
   }

   openDialog(user: User): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: 'Suppression d\'utilisateur', message: `Voulez vous vraiment supprimer l'utilisateur ${user.userLogin} ?` }
    });
  
    dialogRef.componentInstance.actionClicked.subscribe(() => {
      this.deletUser(user);
    });
  }

  async deletUser(user: User) {
    const result = await this.userService.deleteUser(user);
    this.dialog.closeAll();

    if (result == 204) {
      this.userList = await this.userService.getUsers();
    }
  }
}
