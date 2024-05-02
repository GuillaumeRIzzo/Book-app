import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  userForm = new FormGroup({
    userIdentifier: new FormControl('', [Validators.required, this.emailOrLoginValidator()]),
    userPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  emailOrLoginValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      // Check if the value contains '@'
      const hasAtSymbol: boolean = value.includes('@');
      // Check if the value matches the email pattern
      const isEmail: boolean = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  
      if (hasAtSymbol && !isEmail) {
        return { invalidEmailOrUsername: true }; // Return an error if it contains '@' but doesn't match email format
      }
      
      return null; // Return null if validation passes
    };
  }

  async login() {
    const { userIdentifier, userPassword } = this.userForm.value;
    if (userIdentifier && userPassword) {
      const loggedIn = await this.authService.login(userIdentifier, userPassword);
      if (loggedIn) {
        this.router.navigate(['/']);
      } else {
        alert('Wrong identifiant or password, please try again.');
      }
    } else {
      alert('Please fill in both identifiant and password fields.');
    }
  }
}
