import { DbUserModel } from './db-user.model';

export class Shift {
  _id?: string;
  title: string;
  start: Date;
  end: Date;
  wage: number = 0;
  location: string;
  description: string;
  user: DbUserModel;

  constructor(
    id: string,
    title: string,
    start: Date,
    end: Date,
    wage: number = 0,
    location: string,
    description: string,
    user: DbUserModel
  ) {
    this._id = id;
    this.title = title;
    this.start = start;
    this.end = end;
    this.wage = wage;
    this.location = location;
    this.description = description;
    this.user = user;
  }

  get startTime(): string {
    const startTime = new Date(this.start)
      .toTimeString()
      .split(' ')[0]
      .slice(0, -3);
    return startTime;
  }

  get endTime(): string {
    const endTime = new Date(this.end)
      .toTimeString()
      .split(' ')[0]
      .slice(0, -3);
    return endTime;
  }

  get startDate(): string {
    const startDate = new Date(this.start).toDateString();
    return startDate;
  }

  get endDate(): string {
    const endDate = new Date(this.end).toDateString();
    return endDate;
  }

  totalShiftWage(): number {
    const start = new Date(this.start);
    const end = new Date(this.end);
    const hours = (end.getTime() - start.getTime()) / 3600000;
    return this.wage * hours;
  }

  static fromJSON(json: any): Shift {
    const shift = new Shift(
      json._id,
      json.title,
      json.start,
      json.end,
      json.wage,
      json.location,
      json.description,
      json.user
    );
    return shift;
  }
}
