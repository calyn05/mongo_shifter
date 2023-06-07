import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextShiftsComponent } from './next-shifts.component';

describe('NextShiftsComponent', () => {
  let component: NextShiftsComponent;
  let fixture: ComponentFixture<NextShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextShiftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
