import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PasswordMatchDirective } from 'src/app/shared/validators/password-match.directive';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../register/register.component.css'],
})
export class LoginComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _snackBar: SnackbarComponent = inject(SnackbarComponent);
  private _router: Router = inject(Router);
  private _userService: UserService = inject(UserService);

  loginForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        PasswordMatchDirective.patternValidator(new RegExp('(?=.*[0-9])'), {
          hasNumber: true,
        }),
        PasswordMatchDirective.patternValidator(new RegExp('(?=.*[A-Z])'), {
          hasCapitalCase: true,
        }),
        PasswordMatchDirective.patternValidator(new RegExp('(?=.*[a-z])'), {
          hasSmallCase: true,
        }),
        PasswordMatchDirective.patternValidator(
          new RegExp('(?=.*[!@#$%^&*()_+])'),
          {
            hasSpecialCharacters: true,
          }
        ),
      ]),
    });
  }

  login(email: string, password: string) {
    this._authService.login(email, password).subscribe((res) => {
      if (res.status === 'success') {
        let username = res.data.firstName;
        username = (username as string)
          .charAt(0)
          .toUpperCase()
          .concat((username as string).slice(1));

        this._snackBar.openSnackbar(
          `Welcome, ${username}`,
          'Success',
          'success-snackbar'
        );

        this._authService.username = res.data.firstName;
        this._authService.admin =
          res.data.permissions.description.includes('admin');

        if (this._authService.admin) {
          this._router.navigate([`/admin-dashboard/${res.data._id}`]);
        } else {
          this._router.navigate([`/dashboard/${res.data._id}`]);
        }
      }
    });
  }

  checkIfLoggedIn() {
    this._authService.isLoggedIn().subscribe((res) => {
      if (res.includes('true')) {
        const id = res.split('%3D')[1];
        this._router.navigate([`/admin-dashboard/${id}`]);
      }

      if (res.includes('false')) {
        const id = res.split('%3D')[1];
        this._router.navigate([`/dashboard/${id}`]);
      }
    });
  }
}
