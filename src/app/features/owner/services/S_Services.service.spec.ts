/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { S_ServicesService } from './S_Services.service';

describe('Service: S_Services', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [S_ServicesService]
    });
  });

  it('should ...', inject([S_ServicesService], (service: S_ServicesService) => {
    expect(service).toBeTruthy();
  }));
});
