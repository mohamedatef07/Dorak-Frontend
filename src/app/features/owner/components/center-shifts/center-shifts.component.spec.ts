import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterShiftsComponent } from './center-shifts.component';

describe('CenterShiftsComponent', () => {
  let component: CenterShiftsComponent;
  let fixture: ComponentFixture<CenterShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterShiftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
