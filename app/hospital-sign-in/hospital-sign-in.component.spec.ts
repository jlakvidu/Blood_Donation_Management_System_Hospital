import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalSignInComponent } from './hospital-sign-in.component';

describe('HospitalSignInComponent', () => {
  let component: HospitalSignInComponent;
  let fixture: ComponentFixture<HospitalSignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalSignInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HospitalSignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
