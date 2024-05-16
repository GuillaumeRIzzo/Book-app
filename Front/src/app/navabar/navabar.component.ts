import { Component, ViewChild, type OnInit } from '@angular/core';
import { AuthService } from '../auth/authService.service';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-navabar',
  templateUrl: './navabar.component.html',
  styleUrl: './navabar.component.css',
})
export class NavabarComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  
  log: boolean;
  right: boolean;
  login: string;
  userId: string;
  
  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.authService.log$.subscribe(log => {
      this.log = log;
      this.right = this.authService.hasPermission(["Super Admin", "Admin"]);
      this.login = localStorage.getItem("login") || "";
      this.userId = localStorage.getItem("id") || "";
    });
  }

  logout() {
    this.authService.setToken("");
    this.authService.setLog();
    this.router.navigate(["/"]);
  }
}
