/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { UpdateQueueStatusSRService } from './updateQueueStatusSR.service';

describe('Service: SignalRtest', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdateQueueStatusSRService],
    });
  });

  it('should ...', inject(
    [UpdateQueueStatusSRService],
    (service: UpdateQueueStatusSRService) => {
      expect(service).toBeTruthy();
    }
  ));
});
