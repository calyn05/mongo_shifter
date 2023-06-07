import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from 'src/app/components/partials/snackbar/snackbar.component';
import { DbUserModel } from 'src/app/shared/models/db-user.model';
import { Shift } from 'src/app/shared/models/shift.model';
import { ShiftService } from 'src/app/shared/services/shift.service';
import { DateValidatorDirective } from 'src/app/shared/validators/date-validator.directive';

@Component({
  selector: 'app-add-shift',
  templateUrl: './add-shift.component.html',
  styleUrls: [
    './add-shift.component.css',
    '../../../auth/register/register.component.css',
  ],
})
export class AddShiftComponent implements OnInit {
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _shiftsService: ShiftService = inject(ShiftService);
  private _snackbarComponent: SnackbarComponent = inject(SnackbarComponent);

  @HostListener('document:click', ['$event'])
  clickout(event: { target: { id: string } }) {
    if (event.target.id !== 'location') {
      this.filteredLocations = [];
    }
  }

  userId!: string;
  user!: DbUserModel;
  addShiftForm!: FormGroup;
  isSubmitted: boolean = false;
  locations: string[] = [];
  filteredLocations: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['user_id'];
      this.userId = id;
    });

    this.addShiftForm = new FormGroup(
      {
        startDate: new FormControl(null, [Validators.required]),
        startTime: new FormControl(null, [Validators.required]),
        endDate: new FormControl(null, [Validators.required]),
        endTime: new FormControl(null, [Validators.required]),
        wage: new FormControl(null, [Validators.required]),
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

    this._shiftsService.getUserShifts(this.userId).subscribe((shifts) => {
      const shiftArray = shifts.data;
      shiftArray.forEach((shift: any) => {
        const newShift = new Shift(
          shift._id,
          shift.title,
          shift.start,
          shift.end,
          shift.wage,
          shift.location,
          shift.description,
          shift.user
        );
        this.locations = [...new Set(this.locations), shift.location];
        this.user = shift.user;
      });
    });
  }

  canExit(): boolean {
    if (this.addShiftForm.dirty && !this.isSubmitted) {
      return false;
    } else {
      return true;
    }
  }

  onLocationInput(event: any): void {
    const locations = new Set(this.locations);
    const filteredLocations = Array.from(locations).filter((location) =>
      location.toLowerCase().includes(event.target.value.toLowerCase())
    );
    this.filteredLocations = filteredLocations;
  }

  onLocationFocus(): void {
    const locations = new Set(this.locations);
    this.filteredLocations = Array.from(locations);
    if (
      this.locationInput?.errors?.['required'] &&
      this.filteredLocations.length > 0
    ) {
      this.locationInput.setErrors(null);
    }

    if (this.filteredLocations.length > 0) {
      this._snackbarComponent.openSnackbar(
        'Select a location! Or, type a new one',
        'Close',
        'success-snackbar'
      );
    }
  }

  addShift(addShiftForm: FormGroup) {
    const startDate = new Date(
      addShiftForm.value.startDate + ' ' + addShiftForm.value.startTime
    );
    const endDate = new Date(
      addShiftForm.value.endDate + ' ' + addShiftForm.value.endTime
    );

    this._shiftsService
      .createShift(
        addShiftForm.value.title,
        startDate,
        endDate,
        addShiftForm.value.wage,
        this.userId,
        addShiftForm.value.location,
        addShiftForm.value.description
      )
      .subscribe((response) => {
        if (response.status === 'success') {
          this.resetForm();

          this._snackbarComponent.openSnackbar(
            'Shift created successfully!',
            'Close',
            'success-snackbar'
          );
          this.isSubmitted = true;
        }
      });
  }

  resetForm() {
    this.addShiftForm.reset();
  }

  showErrors(): void {
    if (this.startDateInputError) {
      this._snackbarComponent.openSnackbar(
        'Start date must be before end date',
        'Close',
        'error-snackbar'
      );
    } else if (this.startTimeInputError) {
      this._snackbarComponent.openSnackbar(
        'Start time must be before end time',
        'Close',
        'error-snackbar'
      );
    } else {
      this._snackbarComponent.closeSnackbar();
    }
  }

  selectLocation(location: string) {
    const titlecaseLocation =
      location.slice(0, 1).toUpperCase() + location.slice(1);

    this.addShiftForm.patchValue({
      location: titlecaseLocation,
    });
    this.filteredLocations = [];
  }

  get startDateInput() {
    return this.addShiftForm.get('startDate');
  }

  get startTimeInput() {
    return this.addShiftForm.get('startTime');
  }

  get endDateInput() {
    return this.addShiftForm.get('endDate');
  }

  get endTimeInput() {
    return this.addShiftForm.get('endTime');
  }

  get wageInput() {
    return this.addShiftForm.get('wage');
  }

  get locationInput() {
    return this.addShiftForm.get('location');
  }

  get uniqueNameInput() {
    return this.addShiftForm.get('uniqueName');
  }

  get descriptionInput() {
    return this.addShiftForm.get('description');
  }

  get startDateInputError() {
    return this.addShiftForm.get('endDate')?.errors ? ['startDate'] : null;
  }

  get startTimeInputError() {
    return this.addShiftForm.get('endTime')?.errors ? ['startTime'] : null;
  }

  get uniqueNameError() {
    return this.addShiftForm.get('uniqueName')?.errors ? ['uniqueName'] : null;
  }
}
