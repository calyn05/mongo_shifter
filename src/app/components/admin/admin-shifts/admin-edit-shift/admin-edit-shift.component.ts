import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ShiftService } from 'src/app/shared/services/shift.service';
import { DateValidatorDirective } from 'src/app/shared/validators/date-validator.directive';

@Component({
  selector: 'app-admin-edit-shift',
  templateUrl: './admin-edit-shift.component.html',
  styleUrls: [
    './admin-edit-shift.component.css',
    '../../../auth/register/register.component.css',
    '../../../user/shifts/add-shift/add-shift.component.css',
    '../../../auth/register/register.component.css',
  ],
})
export class AdminEditShiftComponent implements OnInit {
  private _shiftsService: ShiftService = inject(ShiftService);
  private _dialog: MatDialog = inject(MatDialog);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _adminService: AdminService = inject(AdminService);
  private _router: Router = inject(Router);

  updateShiftForm!: FormGroup;
  adminId!: string;
  shiftId!: string;

  isSubmitted: boolean = false;

  shiftToEdit!: Shift | undefined | null;
  shiftName: string = '';
  shiftWorker!: DbUserModel | undefined | null;

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['shift_id'];
      this.shiftId = id;
      this.adminId = params['admin_id'];

      this._shiftsService.getShiftById(id).subscribe((shift) => {
        const shiftEdit = new Shift(
          shift.data._id,
          shift.data.title,
          shift.data.start,
          shift.data.end,
          shift.data.wage,
          shift.data.location,
          shift.data.description,
          shift.data.user
        );
        this.shiftToEdit = shiftEdit;

        this.shiftName = shiftEdit.title;
        this.shiftWorker = shiftEdit.user;

        const location = this.toUpperCase(shiftEdit.location);
        const title = this.toUpperCase(shiftEdit.title);
        const description = this.toUpperCase(shiftEdit.description);

        this.updateShiftForm.patchValue({
          startDate: new Date(shiftEdit.start).toLocaleDateString('en-CA'),
          startTime: new Date(shiftEdit.start).toTimeString().split(' ')[0],
          endDate: new Date(shiftEdit.end).toLocaleDateString('en-CA'),
          endTime: new Date(shiftEdit.end).toTimeString().split(' ')[0],
          wage: shiftEdit.wage,
          location: location,
          title: title,
          description: description,
        });
      });
    });
    this.updateShiftForm = new FormGroup(
      {
        startDate: new FormControl('', [Validators.required]),
        startTime: new FormControl('', [Validators.required]),
        endDate: new FormControl('', [Validators.required]),
        endTime: new FormControl('', [Validators.required]),
        wage: new FormControl('', [
          Validators.required,
          Validators.max(10000000),
        ]),
        location: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(2),
        ]),
        title: new FormControl('', [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(2),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(2),
        ]),
      },
      {
        validators: DateValidatorDirective.dateValidator(),
      }
    );
  }

  updateShift(updateShiftForm: FormGroup) {
    const startDate = new Date(
      updateShiftForm.controls['startDate'].value +
        ' ' +
        updateShiftForm.controls['startTime'].value
    );
    const endDate = new Date(
      updateShiftForm.controls['endDate'].value +
        ' ' +
        updateShiftForm.controls['endTime'].value
    );

    this._shiftsService
      .updateShift(
        this.shiftId,
        updateShiftForm.controls['title'].value,
        startDate,
        endDate,
        updateShiftForm.controls['wage'].value,
        updateShiftForm.controls['location'].value,
        updateShiftForm.controls['description'].value
      )
      .subscribe((response) => {
        if (response.status === 'success') {
          this._snackbarComponent.openSnackbar(
            'Shift updated successfully!',
            'Close',
            'success-snackbar'
          );
          this.isSubmitted = true;
        }
      });
  }

  confirmUpdate(updateShiftForm: FormGroup): void {
    const message = 'Are you sure you want to update this shift?';

    const data = new DialogData('Update shift?', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateShift(updateShiftForm);
      }
      this._dialog.closeAll();
    });
  }

  confirmDelete(): void {
    const message = 'Are you sure you want to delete this shift?';

    const data = new DialogData('Delete shift?', message);

    const dialogRef = this._dialog.open(DialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteShift();
      }
      this._dialog.closeAll();
    });
  }

  deleteShift(): void {
    this._adminService.deleteShift(this.shiftId).subscribe((response) => {
      if (response.status === 'success') {
        this._snackbarComponent.openSnackbar(
          'Shift deleted successfully!',
          'Close',
          'success-snackbar'
        );
        this.isSubmitted = true;
        this._router.navigate(['/admin-shifts', this.adminId]);
      }
    });
  }

  toUpperCase(value: string): string {
    return value.slice(0, 1).toUpperCase() + value.slice(1);
  }

  canExit(): boolean {
    if (this.updateShiftForm.dirty && !this.isSubmitted) {
      return false;
    }
    return true;
  }

  showErrors(): void {
    if (this.updateShiftForm.controls['endDate'].errors?.['startDate']) {
      this._snackbarComponent.openSnackbar(
        'End date must be after start date!',
        'Close',
        'error-snackbar'
      );
    } else if (this.updateShiftForm.controls['endTime'].errors?.['startTime']) {
      this._snackbarComponent.openSnackbar(
        'End time must be after start time!',
        'Close',
        'error-snackbar'
      );
    } else {
      this._snackbarComponent.closeSnackbar();
    }
  }

  get f() {
    return this.updateShiftForm.controls;
  }
}
