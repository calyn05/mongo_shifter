import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DialogComponent,
  DialogData,
} from 'src/app/components/partials/dialog/dialog.component';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { DbUserModel } from 'src/app/shared/models/db-user.model';
import { Shift } from 'src/app/shared/models/shift.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-worker-profile',
  templateUrl: './worker-profile.component.html',
  styleUrls: [
    './worker-profile.component.css',
    '../../../user/profile/profile.component.css',
    '../../../auth/register/register.component.css',
  ],
})
export class WorkerProfileComponent implements OnInit {
  private _userService: UserService = inject(UserService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _dialog: MatDialog = inject(MatDialog);
  private _adminService: AdminService = inject(AdminService);

  userId!: string;
  adminId!: string;

  pastWeekShifts: Shift[] = [];
  daysAndHours: { day: string; hours: number }[] = [];

  totalIncome: number = 0;
  incomeFutureShifts: number = 0;

  dbUser: DbUserModel = {
    _id: '',
    email: '',
    firstName: '',
    lastName: '',
    comments: [],
    created: new Date(),
    updated: new Date(),
  };

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.userId = params['worker_id'];
      this.adminId = params['admin_id'];

      this._userService.getUserbyId(this.userId).subscribe((res) => {
        this.dbUser = res.data;
      });
    });
  }

  getAuthUser(uid: string) {}

  confirmDelete(): void {
    const message = 'Are you sure you want to delete this account?';

    const data = new DialogData('Delete account?', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser();
      }
      this._dialog.closeAll();
    });
  }

  deleteUser() {
    this._adminService.deleteUser(this.userId).subscribe((res) => {
      if (res.status === 'success') {
        this._snackbarComponent.openSnackbar(
          'User successfully deleted',
          'Close',
          'success-snackbar'
        );
        this._router.navigate(['admin-workers', this.adminId]);
      }
    });
  }
}
