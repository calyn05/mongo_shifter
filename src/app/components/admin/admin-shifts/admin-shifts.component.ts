import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shift } from 'src/app/shared/models/shift.model';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-admin-shifts',
  templateUrl: './admin-shifts.component.html',
  styleUrls: [
    './admin-shifts.component.css',
    '../../user/shifts/shifts.component.css',
  ],
})
export class AdminShiftsComponent implements OnInit {
  private _adminService: AdminService = inject(AdminService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  searchBy: string = 'search_by_date';

  shifts: Shift[] = [];
  startDate!: string;
  endDate!: string;
  location!: string;
  locations!: string[];
  worker!: string;
  workers!: string[];
  workerId!: string;
  adminId!: string;

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['admin_id'];
      this.adminId = id;
      this._adminService.getAllShifts().subscribe((shifts) => {
        const shiftArray = shifts.data;
        shiftArray.forEach((shift: any) => {
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
          this.locations = [
            ...new Set(this.shifts.map((shift) => shift.location)),
          ];
          this.workers = [
            ...new Set(this.shifts.map((shift) => shift.user.email)),
          ];
        });
      });
    });
  }

  searchByDate(from: string, to: string) {
    this.shifts = [];
    this.startDate = from;
    this.endDate = to;

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
    this.location = location;

    if (location === '') {
      return;
    }

    this.locations.forEach((place) => {
      if (place.includes(location.toLowerCase())) {
        this._adminService.getAllShifts().subscribe((shifts) => {
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

  searchByWorker(worker: string) {
    this.shifts = [];
    this.worker = worker;

    if (worker === '') {
      return;
    }

    this.workers.forEach((person) => {
      if (person.includes(worker.toLowerCase())) {
        this._adminService.getAllShifts().subscribe((shifts) => {
          const shiftArray = shifts.data;
          shiftArray.forEach((shift: any) => {
            if (shift.user.email !== person) {
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
