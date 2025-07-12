/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProviderReviewsComponent } from './provider-reviews.component';

describe('ProviderReviewsComponent', () => {
  let component: ProviderReviewsComponent;
  let fixture: ComponentFixture<ProviderReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
