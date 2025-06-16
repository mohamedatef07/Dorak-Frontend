/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { OwnerFooterComponent } from './owner-footer.component';

describe('FooterComponent', () => {
  let component: OwnerFooterComponent;
  let fixture: ComponentFixture<OwnerFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OwnerFooterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
