import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PasswordMatchDirective } from 'src/app/shared/validators/password-match.directive';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.css',
    '../../auth/register/register.component.css',
    '../../user/shifts/add-shift/add-shift.component.css',
  ],
})
export class ResetPasswordComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  resetForm!: FormGroup;

  code!: string;

  ngOnInit(): void {
    this.code = this._route.snapshot.params['token'];

    this.resetForm = new FormGroup(
      {
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
      },
      {
        validators: PasswordMatchDirective.MatchPassword,
      }
    );
  }

  reset() {
    this._authService
      .resetPassword(this.code, this.resetForm.value.password)
      .subscribe((res) => {
        if (res.status === 'success') {
          this._snackbarComponent.openSnackbar(
            'Your password has been reset successfully.',
            'Close',
            'success-snackbar'
          );
          this._router.navigate(['/login']);
        }
      });
  }

  get f() {
    return this.resetForm.controls;
  }

  get passwordValid() {
    return this.resetForm.controls['password'].valid === null;
  }

  get requireValid() {
    return !this.resetForm.controls['password'].hasError('required');
  }

  get minLengthValid() {
    return !this.resetForm.controls['password'].hasError('minlength');
  }

  get maxLengthValid() {
    return !this.resetForm.controls['password'].hasError('maxlength');
  }

  get hasNumberValid() {
    return !this.resetForm.controls['password'].hasError('hasNumber');
  }

  get hasCapitalCaseValid() {
    return !this.resetForm.controls['password'].hasError('hasCapitalCase');
  }

  get hasSmallCaseValid() {
    return !this.resetForm.controls['password'].hasError('hasSmallCase');
  }

  get hasSpecialCharactersValid() {
    return !this.resetForm.controls['password'].hasError(
      'hasSpecialCharacters'
    );
  }

  get confirmPasswordValid() {
    return this.resetForm.controls['confirmPassword'].valid === null;
  }
}
