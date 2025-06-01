import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { MessageService } from 'primeng/api';
import { IQueueEntries } from '../../models/IQueueEntries';
import { DatePipe } from '@angular/common';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { ClientTypeEnumValuePipe } from '../../../../pipes/ClientTypeEnumValue.pipe';
import { QueueAppointmentStatusEnumValuePipe } from '../../../../pipes/QueueAppointmentStatusEnumValue.pipe';
import { PatientQueueTableComponent } from '../patient-queue-table/patient-queue-table.component';
import { PatientQueueFilterComponent } from '../patient-queue-filter/patient-queue-filter.component';
import { PatientQueueSearchComponent } from '../patient-queue-search/patient-queue-search.component';

@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css'],
  imports: [
    PatientQueueTableComponent,
    PatientQueueFilterComponent,
    PatientQueueSearchComponent,
  ],
})
export class PatientQueueComponent implements OnInit {
  globalSearchValue: string = '';
  ngOnInit() {}
  onSearchInputChange(searchValue: string) {
    this.globalSearchValue = searchValue;
  }
}
