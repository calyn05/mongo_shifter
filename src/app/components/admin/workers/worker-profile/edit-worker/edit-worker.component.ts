import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-worker',
  templateUrl: './edit-worker.component.html',
  styleUrls: [
    './edit-worker.component.css',
    '../../../../user/profile/edit-profile/edit-profile.component.css',
    '../../../../auth/register/register.component.css',
  ],
})
export class EditWorkerComponent implements OnInit {
  private _router: Router = inject(Router);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _userService: UserService = inject(UserService);
  private _dialog: MatDialog = inject(MatDialog);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  editForm!: FormGroup;
  editables: HTMLInputElement[] = [];
  opened!: boolean;
  isSubmitted: boolean = false;
  username!: string;

  property!: string;

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.property = params['property'];
    });

    this.changeProperty();
  }

  changeProperty() {
    switch (this.property) {
      case 'email':
        this.editForm = new FormGroup({
          email: new FormControl(null, [Validators.email, Validators.required]),
        });
        break;

      case 'name':
        this.editForm = new FormGroup({
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
        });
        break;

      default:
        break;
    }
  }

  canExit(): boolean {
    if (this.editForm.dirty && !this.isSubmitted) {
      return false;
    } else {
      return true;
    }
  }

  updateEmail() {}

  updateName() {}

  get f() {
    return this.editForm.controls;
  }
}
