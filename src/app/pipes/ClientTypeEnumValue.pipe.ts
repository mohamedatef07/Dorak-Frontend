import { Pipe, PipeTransform } from '@angular/core';
import { ClientType } from '../Enums/ClientType.enum';

@Pipe({
  name: 'ClientTypeEnumValue',
})
export class ClientTypeEnumValuePipe implements PipeTransform {
  transform(value: ClientType): string {

    return ClientType[value];
  }
}
