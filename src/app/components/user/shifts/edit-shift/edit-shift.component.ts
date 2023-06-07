import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  DialogComponent,
  DialogData,
} from 'src/app/components/partials/dialog/dialog.component';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { Shift } from 'src/app/shared/models/shift.model';
import { ShiftService } from 'src/app/shared/services/shift.service';
import { DateValidatorDirective } from 'src/app/shared/validators/date-validator.directive';

@Component({
  selector: 'app-edit-shift',
  templateUrl: './edit-shift.component.html',
  styleUrls: [
    './edit-shift.component.css',
    '../../../auth/register/register.component.css',
    '../add-shift/add-shift.component.css',
  ],
})
export class EditShiftComponent implements OnInit {
  private _shiftsService: ShiftService = inject(ShiftService);
  private _dialog: MatDialog = inject(MatDialog);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  updateShiftForm!: FormGroup;
  isSubmitted: boolean = false;

  shiftToEdit!: Shift | undefined | null;
  shiftId!: string;
  userId!: string;
  createdAt!: Date;

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['id'];
      const user_id = params['user_id'];
      this.shiftId = id;
      this.userId = user_id;

      this._shiftsService.getShiftById(id).subscribe((shift) => {
        this.createdAt = shift.data.created;
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
        const startDate = new Date(shiftEdit.start).toLocaleDateString('en-CA');
        const startTime = new Date(shiftEdit.start)
          .toTimeString()
          .split(' ')[0];
        const endDate = new Date(shiftEdit.end).toLocaleDateString('en-CA');
        const endTime = new Date(shiftEdit.end).toTimeString().split(' ')[0];
        const location = this.toUpperCase(shiftEdit.location);
        const title = this.toUpperCase(shiftEdit.title);
        const description = this.toUpperCase(shiftEdit.description);

        this.updateShiftForm.patchValue({
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
          wage: shiftEdit.wage,
          location: location,
          title: title,
          description: description,
        });
      });
    });

    this.updateShiftForm = new FormGroup(
      {
        startDate: new FormControl(null, [Validators.required]),
        startTime: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
        endTime: new FormControl(null, [Validators.required]),
        wage: new FormControl(null, [
          Validators.required,
          Validators.max(10000000),
        ]),
        location: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        title: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ]),
        description: new FormControl(null, [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(200),
        ]),
      },
      {
        validators: DateValidatorDirective.dateValidator(),
      }
    );
  }

  toUpperCase(value: string): string {
    return value.slice(0, 1).toUpperCase() + value.slice(1);
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

  canExit(): boolean {
    if (this.updateShiftForm.dirty && !this.isSubmitted) {
      return false;
    }
    return true;
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
}
