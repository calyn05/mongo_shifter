import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PasswordMatchDirective } from 'src/app/shared/validators/password-match.directive';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  registerForm!: FormGroup;

  isSubmitted: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.checkIfLoggedIn();
    this.registerForm = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),

        password: new FormControl(
          null,
          Validators.compose([
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
              { hasSpecialCharacters: true }
            ),
          ])
        ),
        confirmPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        firstName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        lastName: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),

        isAdmin: new FormControl(false),
      },
      {
        validators: PasswordMatchDirective.MatchPassword,
      }
    );

    this.registerForm.get('isAdmin')?.valueChanges.subscribe((value) => {
      if (value) {
      }
    });

    this.registerForm.valueChanges.subscribe((value) => {
      this.canExit();
    });
  }

  canExit(): boolean {
    if (this.registerForm.dirty && this.isSubmitted === false) {
      return false;
    } else {
      return true;
    }
  }

  ngOnDestroy(): void {}

  // getters for form controls

  get f() {
    return this.registerForm.controls;
  }

  get passwordValid() {
    return this.registerForm.controls['password'].valid === null;
  }

  get requireValid() {
    return !this.registerForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.registerForm.controls['password'].hasError('minlength');
  }

  get maxLengthValid() {
    return !this.registerForm.controls['password'].hasError('maxlength');
  }

  get hasNumberValid() {
    return !this.registerForm.controls['password'].hasError('hasNumber');
  }

  get hasCapitalCaseValid() {
    return !this.registerForm.controls['password'].hasError('hasCapitalCase');
  }

  get hasSmallCaseValid() {
    return !this.registerForm.controls['password'].hasError('hasSmallCase');
  }

  get hasSpecialCharactersValid() {
    return !this.registerForm.controls['password'].hasError(
      'hasSpecialCharacters'
    );
  }

  get confirmPasswordValid() {
    return this.registerForm.controls['confirmPassword'].valid === null;
  }

  get firstNameValid() {
    return this.registerForm.controls['firstName'].valid === null;
  }

  get lastNameValid() {
    return this.registerForm.controls['lastName'].valid === null;
  }

  get isAdmin() {
    return this.registerForm.controls['isAdmin'].value;
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean
  ) {
    const user = new UserModel(email, password, firstName, lastName);
    if (isAdmin) {
      user.permissions = '647394ba6f67c41cedddb85b';
    }
    this._authService
      .register(
        user.email,
        user.password!,
        user.firstName,
        user.lastName,
        user.permissions!
      )
      .subscribe((res) => {
        console.log(res);
        if (res.status === 'success') {
          this._snackbarComponent.openSnackbar(
            `Welcome ${res.data.firstName} ${res.data.lastName}!`,
            'Success',
            'success-snackbar'
          );

          this._authService.username = res.data.firstName;
          const isAdmin = res.data.permissions.description.includes('admin');
          console.log(isAdmin);
          if (isAdmin) {
            this._authService.admin = true;
            this._router.navigate([`/admin-dashboard/${res.data._id}`]);
          } else {
            this._authService.admin = false;
            this._router.navigate([`/dashboard/${res.data._id}`]);
          }

          console.log(this._authService.username, this._authService.admin);
        }
      });
    this.isSubmitted = true;
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
