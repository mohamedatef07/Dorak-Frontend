import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'TimeStringToDate',
})
export class TimeStringToDatePipe implements PipeTransform {
  transform(timeString: string | undefined): Date | null {
    if (!timeString) {
      return null;
    }
    const timeParts = timeString.split(':');
    if (timeParts.length < 3) {
      return null;
    }
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      isNaN(seconds) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59
    ) {
      return null;
    }
    const now = new Date();
    const dateWithTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      seconds
    );
    return dateWithTime;
  }
}
