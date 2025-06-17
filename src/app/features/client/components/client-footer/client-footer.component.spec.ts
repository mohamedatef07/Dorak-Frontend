import { async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ClientFooterComponent } from './client-footer.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('FooterComponent', () => {
  let component: ClientFooterComponent;
  let fixture: ComponentFixture<ClientFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientFooterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
