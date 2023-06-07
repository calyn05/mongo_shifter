import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shift } from 'src/app/shared/models/shift.model';
import { ShiftService } from 'src/app/shared/services/shift.service';

@Component({
  selector: 'app-next-shifts',
  templateUrl: './next-shifts.component.html',
  styleUrls: ['./next-shifts.component.css'],
})
export class NextShiftsComponent implements OnInit {
  private _shiftService: ShiftService = inject(ShiftService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  nextShifts: Shift[] = [];
  editShift!: Shift;
  userId!: string;

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['user_id'];
      this.userId = id;
      this._shiftService.getUserShifts(id).subscribe((shifts) => {
        shifts.data.forEach((shift: Shift) => {
          const now = new Date();
          const shiftStart = new Date(shift.start);

          if (shiftStart > now) {
            this.nextShifts.push(
              new Shift(
                shift._id!,
                shift.title,
                shift.start,
                shift.end,
                shift.wage,
                shift.location,
                shift.description,
                shift.user
              )
            );
          }
        });
      });
    });
  }
}
