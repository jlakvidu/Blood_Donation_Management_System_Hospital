import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDonorsComponent } from './view-donors.component';

describe('ViewDonorsComponent', () => {
  let component: ViewDonorsComponent;
  let fixture: ComponentFixture<ViewDonorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDonorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDonorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
