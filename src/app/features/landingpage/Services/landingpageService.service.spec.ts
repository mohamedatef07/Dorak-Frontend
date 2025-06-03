/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LandingpageServiceService } from './landingpageService.service';

describe('Service: LandingpageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingpageServiceService]
    });
  });

  it('should ...', inject([LandingpageServiceService], (service: LandingpageServiceService) => {
    expect(service).toBeTruthy();
  }));
});
