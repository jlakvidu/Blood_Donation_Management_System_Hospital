import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalDashboardComponent } from './hospital-dashboard.component';

describe('HospitalDashboardComponent', () => {
  let component: HospitalDashboardComponent;
  let fixture: ComponentFixture<HospitalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
