import { QueueAppointmentStatus } from '../Enums/QueueAppointmentStatus.enum';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'QueueAppointmentStatusEnumValue',
})
export class QueueAppointmentStatusEnumValuePipe implements PipeTransform {
  transform(value: QueueAppointmentStatus): string {
    if (!value) {
      return '';
    }
    return QueueAppointmentStatus[value];
  }
}
