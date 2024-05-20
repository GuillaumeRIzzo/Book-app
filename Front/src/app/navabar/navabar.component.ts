import { Component } from '@angular/core';
import { AuthService } from '../auth/authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navabar',
  templateUrl: './navabar.component.html',
  styleUrls: ['./navabar.component.css'],
})
export class NavabarComponent {
  log: boolean;
  right: boolean;
  login: string;
  userId: string;
  timedOutCloser: any;
  
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

  mouseEnter(trigger: { openMenu: () => void; }) {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  mouseLeave(trigger: { closeMenu: () => void; }) {
    this.timedOutCloser = setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }
  
  logout() {
    this.authService.setToken("");
    this.authService.setLog();
    this.router.navigate(["/"]);
  }
}
