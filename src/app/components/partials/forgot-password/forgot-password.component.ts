import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.css',
    '../../auth/register/register.component.css',
  ],
})
export class ForgotPasswordComponent implements OnInit {
  private _authService: AuthService = inject(AuthService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _router: Router = inject(Router);
  forgotPasswordForm!: FormGroup;

  message: string =
    'Enter your email address and we will send you a link to reset your password.';

  constructor() {}

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onSubmit(email: string) {
    this._authService.forgotPassword(email).subscribe((res) => {
      if (res.status === 'success') {
        this._snackbarComponent.openSnackbar(
          'A link to reset your password has been sent to your email address.',
          'Close',
          'success-snackbar'
        );
        this._router.navigate(['/login']);
      }
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  get emailInvalid() {
    return this.email?.invalid && this.email?.touched;
  }
}
