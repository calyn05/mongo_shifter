import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbUserModel } from 'src/app/shared/models/db-user.model';
import { Shift } from 'src/app/shared/models/shift.model';
import { CommentsService } from 'src/app/shared/services/comments.service';
import { UserService } from 'src/app/shared/services/user.service';
import {
  DialogComponent,
  DialogData,
} from '../../partials/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarComponent } from '../../partials/snackbar/snackbar.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.css',
    '../../auth/register/register.component.css',
  ],
})
export class ProfileComponent implements OnInit {
  private _userService: UserService = inject(UserService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _commentsService: CommentsService = inject(CommentsService);
  private _dialog: MatDialog = inject(MatDialog);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  user!: DbUserModel | null | undefined;
  editActive: boolean = false;
  editId!: string;

  pastWeekShifts: Shift[] = [];
  daysAndHours: { day: string; hours: number }[] = [];

  totalIncome: number = 0;
  incomeFutureShifts: number = 0;

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this._userService.getUserbyId(params['user_id']).subscribe((res) => {
        if (res.status === 'success') {
          this.user = res.data;
        }
      });
    });

    this._commentsService.editActive.subscribe((res) => {
      this.editActive = res;

      if (!res) {
        this.getUserComments(this._route.snapshot.params['user_id']);
      }
    });
  }

  getUserComments(id: string) {
    this._userService.getUserbyId(id).subscribe((res) => {
      if (res.status === 'success') {
        this.user = res.data;
      }
    });
  }

  editComment(id: string) {
    this.editId = id;
    this._commentsService.editComment(id);
  }

  confirmDelete(id: string): void {
    const message = 'Are you sure you want to delete your account?';

    const data = new DialogData('Delete account?', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(id);
      }
      this._dialog.closeAll();
    });
  }

  closeEdit() {
    this._commentsService.editActive.next(false);
  }

  deleteUser(id: string) {
    this._userService.deleteMe(id).subscribe(() => {
      const cookie = document.cookie.split(';').find((cookie) => {
        return cookie.includes('usad_id');
      });
      if (!cookie) {
        this._snackbarComponent.openSnackbar(
          'Account deleted',
          'success',
          'success-snackbar'
        );
        this._router.navigate(['/']);
      }
    });
  }
}
