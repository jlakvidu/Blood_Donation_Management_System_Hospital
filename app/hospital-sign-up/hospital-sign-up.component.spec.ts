import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSignUpComponent } from './hospital-sign-up.component';

describe('HospitalSignUpComponent', () => {
  let component: HospitalSignUpComponent;
  let fixture: ComponentFixture<HospitalSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalSignUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
