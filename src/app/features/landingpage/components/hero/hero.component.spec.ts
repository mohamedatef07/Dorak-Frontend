/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

<<<<<<<< HEAD:src/app/features/owner/components/owner-sidebar/owner-sidebar.component.spec.ts
import { SidebarComponent } from './owner-sidebar.component';
========
import { HeroComponent } from './hero.component';
>>>>>>>> 9c64dc505cc4c61ba551c25859ed73db87f5ae02:src/app/features/landingpage/components/hero/hero.component.spec.ts

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
