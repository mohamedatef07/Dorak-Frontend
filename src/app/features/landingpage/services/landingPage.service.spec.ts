/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LandingPageService } from './landingPage.service';

describe('Service: LandingpageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandingPageService],
    });
  });

  it('should ...', inject(
    [LandingPageService],
    (service: LandingPageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
