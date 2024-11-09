import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmerganzyComponent } from './emerganzy.component';

describe('EmerganzyComponent', () => {
  let component: EmerganzyComponent;
  let fixture: ComponentFixture<EmerganzyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmerganzyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmerganzyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
