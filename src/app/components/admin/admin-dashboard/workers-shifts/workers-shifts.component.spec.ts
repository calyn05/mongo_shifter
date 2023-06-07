import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersShiftsComponent } from './workers-shifts.component';

describe('WorkersShiftsComponent', () => {
  let component: WorkersShiftsComponent;
  let fixture: ComponentFixture<WorkersShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkersShiftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkersShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
