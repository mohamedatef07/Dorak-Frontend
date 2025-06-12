/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignalRtestService } from './signalRtest.service';

describe('Service: SignalRtest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalRtestService]
    });
  });

  it('should ...', inject([SignalRtestService], (service: SignalRtestService) => {
    expect(service).toBeTruthy();
  }));
});
