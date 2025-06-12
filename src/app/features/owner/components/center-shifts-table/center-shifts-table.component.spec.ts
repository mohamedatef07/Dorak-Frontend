import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterShiftsTableComponent } from './center-shifts-table.component';

describe('CenterShiftsTableComponent', () => {
  let component: CenterShiftsTableComponent;
  let fixture: ComponentFixture<CenterShiftsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterShiftsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterShiftsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
