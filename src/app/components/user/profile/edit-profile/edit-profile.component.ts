import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PasswordMatchDirective } from 'src/app/shared/validators/password-match.directive';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: [
    './edit-profile.component.css',
    '../../../auth/register/register.component.css',
  ],
})
export class EditProfileComponent implements OnInit {
  private _router: Router = inject(Router);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _authService: AuthService = inject(AuthService);
  private _userService: UserService = inject(UserService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  opened!: boolean;
  isSubmitted: boolean = false;

  email: string = '';
  firstName: string = '';
  lastName: string = '';
  editForm!: FormGroup;
  editables: HTMLInputElement[] = [];

  userId!: string;

  property!: string;

  constructor() {}

  ngOnInit(): void {
    this.editForm = new FormGroup({
      email: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      oldPassword: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });

    this._route.params.subscribe((params) => {
      this.property = params['property'];
      this.userId = params['user_id'];

      this._userService.getUserbyId(this.userId).subscribe((res) => {
        if (res.status === 'success') {
          this.email = res.data.email;
          this.firstName = res.data.firstName;
          this.lastName = res.data.lastName;
          this.changeProperty();
        }
      });
    });
  }

  canExit(): boolean {
    if (this.editForm.dirty && !this.isSubmitted) {
      return false;
    } else {
      return true;
    }
  }

  changeProperty() {
    switch (this.property) {
      case 'email':
        this.editForm = new FormGroup({
          email: new FormControl(this.email, [
            Validators.email,
            Validators.required,
          ]),
        });
        break;

      case 'password':
        this.editForm = new FormGroup(
          {
            oldPassword: new FormControl(
              null,
              Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[0-9])'),
                  {
                    hasNumber: true,
                  }
                ),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[A-Z])'),
                  {
                    hasCapitalCase: true,
                  }
                ),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[a-z])'),
                  {
                    hasSmallCase: true,
                  }
                ),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[!@#$%^&*()_+])'),
                  { hasSpecialCharacters: true }
                ),
              ])
            ),
            password: new FormControl(
              null,
              Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[0-9])'),
                  {
                    hasNumber: true,
                  }
                ),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[A-Z])'),
                  {
                    hasCapitalCase: true,
                  }
                ),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[a-z])'),
                  {
                    hasSmallCase: true,
                  }
                ),
                PasswordMatchDirective.patternValidator(
                  new RegExp('(?=.*[!@#$%^&*()_+])'),
                  { hasSpecialCharacters: true }
                ),
              ])
            ),
            confirmPassword: new FormControl(null, [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(20),
            ]),
          },
          { validators: PasswordMatchDirective.MatchPassword }
        );
        break;
      case 'name':
        this.editForm = new FormGroup({
          firstName: new FormControl(this.firstName, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
          ]),
          lastName: new FormControl(this.lastName, [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(20),
          ]),
        });
        break;
      case 'age':
        this.editForm = new FormGroup({
          age: new FormControl(null, [
            Validators.required,
            Validators.min(18),
            Validators.max(130),
          ]),
        });
        break;

      default:
        break;
    }
  }

  updateEmail() {
    this.isSubmitted = true;

    this._authService
      .updateUser(this.userId, this.editForm.value)
      .subscribe((res) => {
        if (res.status === 'success') {
          this._snackbarComponent.openSnackbar(
            'Email updated successfully',
            'Close',
            'success-snackbar'
          );

          this._router.navigate([`/profile/${this.userId}`]);
        }
      });
  }

  updatePassword() {
    this.isSubmitted = true;
    const currentPassword = this.editForm.value.oldPassword;
    const newPassword = this.editForm.value.password;

    this._authService
      .updatePassword(this.userId, currentPassword, newPassword)
      .subscribe((res) => {
        if (res.status === 'success') {
          this._snackbarComponent.openSnackbar(
            'Password updated successfully',
            'Close',
            'success-snackbar'
          );

          this._router.navigate([`/profile/${this.userId}`]);
        }
      });
  }

  updateName() {
    this.isSubmitted = true;

    this._authService
      .updateUser(this.userId, this.editForm.value)
      .subscribe((res) => {
        if (res.status === 'success') {
          this._snackbarComponent.openSnackbar(
            'Name updated successfully',
            'Close',
            'success-snackbar'
          );

          this._router.navigate([`/profile/${this.userId}`]);
        }
      });
  }

  ngOnDestroy(): void {}

  get f() {
    return this.editForm.controls;
  }

  get passwordValid() {
    return this.editForm.controls['password'].valid === null;
  }

  get oldPasswordValid() {
    return this.editForm.controls['oldPassword'].valid === null;
  }

  get requireValid() {
    return !this.editForm.controls['password'].hasError('required');
  }

  get requireOldValid() {
    return !this.editForm.controls['oldPassword'].hasError('required');
  }

  get minLengthValid() {
    return !this.editForm.controls['password'].hasError('minlength');
  }

  get minLengthValidOld() {
    return !this.editForm.controls['oldPassword'].hasError('minlength');
  }

  get maxLengthValid() {
    return !this.editForm.controls['password'].hasError('maxlength');
  }

  get maxLengthValidOld() {
    return !this.editForm.controls['oldPassword'].hasError('maxlength');
  }

  get hasNumberValid() {
    return !this.editForm.controls['password'].hasError('hasNumber');
  }

  get hasNumberValidOld() {
    return !this.editForm.controls['oldPassword'].hasError('hasNumber');
  }

  get hasCapitalCaseValid() {
    return !this.editForm.controls['password'].hasError('hasCapitalCase');
  }

  get hasCapitalCaseValidOld() {
    return !this.editForm.controls['oldPassword'].hasError('hasCapitalCase');
  }

  get hasSmallCaseValid() {
    return !this.editForm.controls['password'].hasError('hasSmallCase');
  }

  get hasSmallCaseValidOld() {
    return !this.editForm.controls['oldPassword'].hasError('hasSmallCase');
  }

  get hasSpecialCharactersValid() {
    return !this.editForm.controls['password'].hasError('hasSpecialCharacters');
  }

  get hasSpecialCharactersValidOld() {
    return !this.editForm.controls['oldPassword'].hasError(
      'hasSpecialCharacters'
    );
  }

  get confirmPasswordValid() {
    return this.editForm.controls['confirmPassword'].valid === null;
  }
}
