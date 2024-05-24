import { Component, ElementRef, Input, ViewChild, type OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../../auth/authService.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './userForm.component.html',
  styleUrl: './userForm.component.css',
})
export class UserFormComponent implements OnInit {
  @ViewChild('firstInput') firstInput: ElementRef;
  @Input() userId: string;

  right: boolean;
  sa: boolean;
  canChange: boolean;
  isUser: boolean;
  badRequest: boolean;
  hide = true;

  userForm = new FormGroup({
    userId: new FormControl(0, [Validators.required]),
    userFirstname: new FormControl('', [Validators.required]),
    userLastname: new FormControl('', [Validators.required]),
    userPassword: new FormControl(''),
    userLogin: new FormControl('', [Validators.required, this.loginValidator()]),
    userEmail: new FormControl('', [Validators.required, this.emailValidator()]),
    userRight: new FormControl("User", [Validators.required]),
  });

  passwordForm = new FormGroup({
    newPassword: new FormControl('', [Validators.required, this.passwordValidator()]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });

  ngAfterViewInit() {
    Promise.resolve().then(() => this.firstInput.nativeElement.focus());
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog) { }

  async ngOnInit() {
    this.isUser = this.route.snapshot.url.join('/').includes("user");
    
    this.passwordForm.controls['confirmNewPassword'].setValidators([Validators.required, this.matchedPassword(this.passwordForm.controls['newPassword'])]);

    if (this.isUser) {
      this.route.params.subscribe(async (params: Params) => {
      this.userId = params['id'];

      if (this.userId) {
        this.userForm.patchValue(await this.userService.getUser(+this.userId));
  
        if (this.authService.hasPermission(["Super Admin"])) {
          this.right = true;
          if (this.userForm.controls.userRight.value == "Super Admin") {
            this.sa = true;
          }
        } else if (this.authService.hasPermission(["Admin"]) && this.userForm.controls.userRight.value == "User") {
          this.right = true;
        }
        this.canChange = this.userId == localStorage.getItem("id");
      }
      })
    }
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      // Check if the value matches the email pattern
      const isEmail: boolean = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  
      if (!isEmail) {
        return { invalidEmail: true }; // Return an error if it contains '@' but doesn't match email format
      }
      
      return null; // Return null if validation passes
    };
  }

  loginValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;

      const hasAtSymbol: boolean = value.includes('@');

      if (hasAtSymbol) {
        return { invalidLogin: true };
      }

      return null;
    }
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      const errors: { [key: string]: any } = {};
  
      const hasUppercase = /[A-Z]/.test(value);
      const hasLowercase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[@$!%*?&-_]/.test(value);
      const hasMinLength = value.length >= 8;

      if (!hasUppercase) {
        errors['missingUppercase'] = true;
      }
      if (!hasLowercase) {
        errors['missingLowercase'] = true;
      }
      if (!hasNumber) {
        errors['missingNumber'] = true;
      }
      if (!hasSpecialChar) {
        errors['missingSpecialChar'] = true;
      }
      if (!hasMinLength) {
        errors['minLength'] = true
      }
  
      if (Object.keys(errors).length === 0) {
        return null;
      } else {
        return errors;
      }
    };
  }  
  
  isCriterionValid(criterion: string): boolean {
    return !this.passwordForm.get('newPassword')?.errors?.[criterion];
  }

  matchedPassword(newPasswordControl: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any} | null => {
      const value: string = control.value;
  
      const matched = newPasswordControl.value == value;
  
      if (!matched) {
        return { invalidMatched: true };
      }
  
      return null;
    };
  }

  async onSubmit() {
    if (this.isUser) {
      const result = await this.userService.updateUser((this.userForm.value as User));
      if (result == 204) {
        this.router.navigate(["users"]);
      }
    }
    else {
      const newPassword = this.passwordForm.controls['newPassword'].value;
      this.userForm.controls.userPassword.setValue(newPassword);
      
      const result = await this.userService.addUser((this.userForm.value as User))
      if (result == 201) {
        this.router.navigate(["login"]);
      }
    }
  }

  async passwordSubmit() {
    const newPassword = this.passwordForm.controls['newPassword'].value;
    this.userForm.controls.userPassword.setValue(newPassword);

    const result = await this.userService.updateUser((this.userForm.value as User))
    if (result == 204) {
      this.router.navigate(["users"]);
    }

    if (result == 400) {
      this.badRequest = true;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { title: 'Suppression de votre compte', message: `Voulez vous vraiment supprimer votre compte ?` }
    });
  
    dialogRef.componentInstance.actionClicked.subscribe(() => {
      this.deletUser(this.userId);
    });
  }

  async deletUser(userId: string) {
    const result = await this.userService.deleteUser(+userId);
    this.dialog.closeAll();

    if (result == 204) {

    }
  }
}
