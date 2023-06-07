import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shift } from 'src/app/shared/models/shift.model';
import { ShiftService } from 'src/app/shared/services/shift.service';

@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
})
export class ShiftsComponent implements OnInit, OnDestroy {
  private _shiftService: ShiftService = inject(ShiftService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  myShifts: Shift[] = [];
  locations!: string[];
  userId!: string;
  dateStart!: string;
  dateEnd!: string;
  shiftLocation!: string;

  ngOnInit(): void {
    this.myShifts = [];

    this._route.params.subscribe((params) => {
      const id = params['user_id'];
      this.userId = id;
      this._shiftService.getUserShifts(id).subscribe((shifts) => {
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
          this.myShifts.push(newShift);
          this.locations = [
            ...new Set(this.myShifts.map((shift) => shift.location)),
          ];
        });
      });
    });
  }
  constructor() {}

  searchByLocation(location: string) {
    this.myShifts = [];
    this.shiftLocation = location;

    if (location === '') {
      return;
    }

    this.locations.forEach((place) => {
      if (place.includes(location.toLowerCase())) {
        this._shiftService.getUserShifts(this.userId).subscribe((shifts) => {
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
            this.myShifts.push(newShift);
          });
        });
      }
    });
  }

  searchByDate(fromDate: string, toDate: string) {
    this.myShifts = [];
    this.dateStart = fromDate;
    this.dateEnd = toDate;

    if (fromDate === '' || toDate === '') {
      return;
    }

    this._shiftService.getUserShifts(this.userId).subscribe((shifts) => {
      const shiftArray = shifts.data;
      shiftArray.forEach((shift: any) => {
        const startDate = shift.start.split('T')[0];
        const endDate = shift.end.split('T')[0];
        if (startDate < fromDate || endDate > toDate) {
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
        this.myShifts.push(newShift);
      });
    });
  }

  ngOnDestroy(): void {}
}
