/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavClientComponent } from './nav-client.component';

describe('NavClientComponent', () => {
  let component: NavClientComponent;
  let fixture: ComponentFixture<NavClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
