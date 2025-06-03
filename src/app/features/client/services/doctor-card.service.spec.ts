/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DoctorCardService } from './doctor-card.service';

describe('Service: DoctorCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DoctorCardService]
    });
  });

  it('should ...', inject([DoctorCardService], (service: DoctorCardService) => {
    expect(service).toBeTruthy();
  }));
});
