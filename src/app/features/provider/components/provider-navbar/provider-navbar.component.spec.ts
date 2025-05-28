import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNavbarComponent } from './provider-navbar.component';

describe('ProviderNavbarComponent', () => {
  let component: ProviderNavbarComponent;
  let fixture: ComponentFixture<ProviderNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
