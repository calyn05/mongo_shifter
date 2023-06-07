import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Shift } from 'src/app/shared/models/shift.model';
import { ShiftService } from 'src/app/shared/services/shift.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  private _shiftsService: ShiftService = inject(ShiftService);
  private _route: ActivatedRoute = inject(ActivatedRoute);

  public chart!: Chart;
  public months: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const id = params['user_id'];
      this._shiftsService.getUserShifts(id).subscribe((shifts) => {
        this.calculateIncomePerMonth(shifts.data);
      });
    });
  }

  calculateIncomePerMonth(shifts: Shift[]) {
    const earningsPerMonth: { month: string; income: number }[] = [];
    const newShiftsArr: Shift[] = [];
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    if (shifts.length === 0) {
      return;
    }
    const lastYearShifts = shifts.filter((shift) => {
      return (
        new Date(shift.start) >= lastYear && new Date(shift.start) <= today
      );
    });

    this.months = lastYearShifts.map((shift) => {
      return new Date(shift.start).toLocaleString('default', {
        month: 'short',
      });
    });

    lastYearShifts.forEach((shift) => {
      newShiftsArr.push(
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
    });

    const earningsPerMonthObj = newShiftsArr.reduce((acc, shift) => {
      const month = new Date(shift.start).toLocaleString('default', {
        month: 'short',
      });
      const year = new Date(shift.start).getFullYear();
      const monthYear = `${month} ${year}`;
      if (!acc[monthYear]) {
        acc[monthYear] = shift.totalShiftWage();
      } else {
        acc[monthYear] += shift.totalShiftWage();
      }
      return acc;
    }, {} as { [key: string]: number });

    for (const month in earningsPerMonthObj) {
      earningsPerMonth.push({ month, income: earningsPerMonthObj[month] });
    }

    earningsPerMonth.sort((a, b) => {
      return new Date(a.month).getTime() - new Date(b.month).getTime();
    });

    this.createChart(earningsPerMonth);
  }

  createChart(earningsPerMonth: { month: string; income: number }[]) {
    this.chart = new Chart('incomeChart', {
      type: 'bar',
      data: {
        labels: earningsPerMonth.map((month) => month.month),
        datasets: [
          {
            label: 'Dollars',
            data: earningsPerMonth.map((month) => month.income),
            backgroundColor: '#00ff0050',
            hoverBackgroundColor: '#00ff99',
          },
          {
            label: 'Euros',
            data: earningsPerMonth.map((month) => month.income * 0.85),
            backgroundColor: '#ffcc0050',
            hoverBackgroundColor: '#ffcc99',
          },
          {
            label: 'Pounds',
            data: earningsPerMonth.map((month) => month.income * 0.73),
            backgroundColor: '#ff000050',
            hoverBackgroundColor: '#ff9999',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        color: '#fff',
        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              callback: function (value: any) {
                return '$' + value;
              },
            },
          },
        },
      },
    });
  }
}
