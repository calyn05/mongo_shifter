import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DbUserModel } from 'src/app/shared/models/db-user.model';
import { Shift } from 'src/app/shared/models/shift.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ShiftService } from 'src/app/shared/services/shift.service';

@Component({
  selector: 'app-worker-shifts',
  templateUrl: './worker-shifts.component.html',
  styleUrls: [
    './worker-shifts.component.css',
    '../../../user/shifts/shifts.component.css',
  ],
})
export class WorkerShiftsComponent implements OnInit {
  private _shiftsService: ShiftService = inject(ShiftService);
  private _adminService: AdminService = inject(AdminService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  adminId!: string;
  shifts: Shift[] = [];
  fromDate!: string;
  toDate!: string;
  locationTerm!: string;
  worker!: DbUserModel;
  workerId!: string;
  firstName!: string;
  lastName!: string;
  locations!: string[];

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['worker_id'];
      this.adminId = params['admin_id'];
      this.workerId = id;
      this._shiftsService.getUserShifts(id).subscribe((shifts) => {
        shifts.data.forEach((shift: any) => {
          const start = new Date(shift.start);
          const end = new Date(shift.end);
          const newShift = new Shift(
            shift._id,
            shift.title,
            start,
            end,
            shift.wage,
            shift.location,
            shift.description,
            shift.user
          );
          this.shifts.push(newShift);
          this.worker = shift.user;
          this.firstName = this.worker.firstName;
          this.lastName = this.worker.lastName;

          this.locations = [
            ...new Set(this.shifts.map((shift) => shift.location)),
          ];
        });
      });
    });
  }

  searchByDate(from: string, to: string) {
    this.shifts = [];
    this.fromDate = from;
    this.toDate = to;

    if (from === '' || to === '') {
      return;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    this._adminService.getShiftsBetweenDates(fromDate, toDate).subscribe(
      (shifts) => {
        shifts.data.forEach((shift: any) => {
          this.shifts.push(
            new Shift(
              shift._id,
              shift.title,
              shift.start,
              shift.end,
              shift.wage,
              shift.location,
              shift.description,
              shift.user
            )
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  searchByLocation(location: string) {
    this.shifts = [];
    this.locationTerm = location;

    if (location === '') {
      return;
    }

    this.locations.forEach((place) => {
      if (place.includes(location.toLowerCase())) {
        this._shiftsService.getUserShifts(this.workerId).subscribe((shifts) => {
          const shiftArray = shifts.data;
          shiftArray.forEach((shift: any) => {
            if (shift.location !== place) {
              return;
            }
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
            this.shifts.push(newShift);
          });
        });
      } else {
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    });
  }
}
