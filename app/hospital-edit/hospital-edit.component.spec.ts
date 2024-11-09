import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalEditComponent } from './hospital-edit.component';

describe('HospitalEditComponent', () => {
  let component: HospitalEditComponent;
  let fixture: ComponentFixture<HospitalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
