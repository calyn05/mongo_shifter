import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shift } from 'src/app/shared/models/shift.model';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-workers-shifts',
  templateUrl: './workers-shifts.component.html',
  styleUrls: [
    './workers-shifts.component.css',
    '../../../user/dashboard/next-shifts/next-shifts.component.css',
  ],
})
export class WorkersShiftsComponent implements OnInit {
  private _adminService: AdminService = inject(AdminService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  adminId!: string;
  shifts: Shift[] = [];
  month!: Date;
  constructor() {}

  ngOnInit(): void {
    this.adminId = this._route.snapshot.params['admin_id'];
    this._adminService.getAllShifts().subscribe((shifts) => {
      const thisMonth = new Date().getMonth();
      this.month = new Date();

      shifts.data.forEach((shift: Shift) => {
        const shiftMonth = new Date(shift.start).getMonth();
        if (shiftMonth === thisMonth) {
          this.shifts.push(
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

      this.shifts.sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
    });
  }
}
