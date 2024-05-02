import { Component, type OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navabar',
  templateUrl: './navabar.component.html',
  styleUrl: './navabar.component.css',
})
export class NavabarComponent implements OnInit {
  log: boolean;

  constructor(
    private UserService: UserService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.log = this.authService.isLog();
  }

  logout() {
    this.authService.setToken("");
    this.authService.isLog();
    this.router.navigate(["/"]);
  }
}
