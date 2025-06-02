import { Pipe, PipeTransform } from '@angular/core';
import { AppointmentStatus } from '../Enums/AppointmentStatus.enum';

@Pipe({
  name: 'AppointmentStatusEnumValue'
})
export class AppointmentStatusEnumValuePipe implements PipeTransform {

  transform(value: AppointmentStatus): string {
    return AppointmentStatus[value];
  }

}
