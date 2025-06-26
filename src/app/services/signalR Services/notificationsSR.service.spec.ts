/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotificationsSRService } from './notificationsSR.service';

describe('Service: NotificationsSR', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsSRService]
    });
  });

  it('should ...', inject([NotificationsSRService], (service: NotificationsSRService) => {
    expect(service).toBeTruthy();
  }));
});
