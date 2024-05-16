import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../../auth/authService.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './userEdit.component.html',
  styleUrl: './userEdit.component.css',
})
export class UserEditComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService) { }

  async ngOnInit() { }
}
