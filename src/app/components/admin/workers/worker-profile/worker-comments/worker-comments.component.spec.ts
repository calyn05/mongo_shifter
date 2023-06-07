import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerCommentsComponent } from './worker-comments.component';

describe('WorkerCommentsComponent', () => {
  let component: WorkerCommentsComponent;
  let fixture: ComponentFixture<WorkerCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
