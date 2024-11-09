import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmerganzyBloodNeedComponent } from './view-emerganzy-blood-need.component';

describe('ViewEmerganzyBloodNeedComponent', () => {
  let component: ViewEmerganzyBloodNeedComponent;
  let fixture: ComponentFixture<ViewEmerganzyBloodNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEmerganzyBloodNeedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEmerganzyBloodNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
