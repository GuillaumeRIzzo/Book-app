import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css',
})
export class InscriptionComponent implements OnInit {

  userForm = new FormGroup({
    userId: new FormControl(0, { nonNullable: true }),
    userFirstname: new FormControl('', { nonNullable: true }),
    userLastname: new FormControl('', { nonNullable: true }),
    userPassword: new FormControl('', { nonNullable: true }),
    userLogin: new FormControl('', { nonNullable: true }),
    userEmail: new FormControl('', { nonNullable: true }),
    userRight: new FormControl("User", { nonNullable: true }),
  });

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  async onSubmit() {
    const result = await this.userService.addUser((this.userForm.value as User))
    alert(result.status);
  }
}
