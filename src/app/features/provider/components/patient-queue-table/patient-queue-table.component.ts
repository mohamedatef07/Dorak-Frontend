import { QueueAppointmentStatus } from './../../../../Enums/QueueAppointmentStatus.enum';
import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { MessageService } from 'primeng/api';
import { IQueueEntries } from '../../models/IQueueEntries';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { ClientTypeEnumValuePipe } from '../../../../pipes/ClientTypeEnumValue.pipe';
import { QueueAppointmentStatusEnumValuePipe } from '../../../../pipes/QueueAppointmentStatusEnumValue.pipe';
import { FormsModule } from '@angular/forms';
import { ClientType } from '../../../../Enums/ClientType.enum';

@Component({
  selector: 'app-patient-queue-table',
  templateUrl: './patient-queue-table.component.html',
  styleUrls: ['./patient-queue-table.component.css'],
  imports: [
    DatePipe,
    TimeStringToDatePipe,
    ClientTypeEnumValuePipe,
    QueueAppointmentStatusEnumValuePipe,
    CommonModule,
  ],
})
export class PatientQueueTableComponent implements OnInit {
  providerServices = inject(ProviderService);
  messageServices = inject(MessageService);
  QueueAppointmentStatus = QueueAppointmentStatus;
  originalQueueEntries: Array<IQueueEntries> = [];
  tempQueueEntries: Array<IQueueEntries> = [];
  @Input() searchText: string = '';
  @Input() patientStatus: string = '';
  @Input() patientType: string = '';

  constructor() {}

  ngOnInit() {
    this.providerServices.getQueueEntries().subscribe({
      next: (res) => {
        this.originalQueueEntries = [...res.Data];
        this.tempQueueEntries = this.originalQueueEntries;
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText']) {
      this.handelQueueEntriesSearch();
    }
    if (changes['patientStatus']) {
      this.handelQueueEntriesPatientStatusFilter();
    }
    if (changes['patientType']) {
      this.handelQueueEntriesPatientTypeFilter();
    }
  }
  handelQueueEntriesPatientStatusFilter() {
    if (!this.patientStatus || this.patientStatus.trim() == '') {
      this.originalQueueEntries = this.tempQueueEntries;
      return;
    }
    this.originalQueueEntries = this.tempQueueEntries;
    const filteredQueueEntries = this.originalQueueEntries.filter(
      (entry) =>
        this.getAppointmentStatusValue(entry.Status) === this.patientStatus
    );
    this.originalQueueEntries = [...filteredQueueEntries];
  }
  handelQueueEntriesPatientTypeFilter() {
    if (!this.patientType || this.patientType.trim() == '') {
      this.originalQueueEntries = this.tempQueueEntries;
      return;
    }
    this.originalQueueEntries = this.tempQueueEntries;
    const filteredQueueEntries = this.originalQueueEntries.filter(
      (entry) => this.getClientTypeValue(entry.ClientType) === this.patientType
    );
    this.originalQueueEntries = [...filteredQueueEntries];
  }
  handelQueueEntriesSearch() {
    if (!this.searchText || this.searchText.trim() == '') {
      this.originalQueueEntries = this.tempQueueEntries;
      return;
    }
    this.originalQueueEntries = this.tempQueueEntries;
    const filteredQueueEntries = this.originalQueueEntries.filter((entry) =>
      entry.FullName.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.originalQueueEntries = [...filteredQueueEntries];
  }
  getClientTypeValue(value: ClientType) {
    return ClientType[value];
  }
  getAppointmentStatusValue(value: QueueAppointmentStatus) {
    return QueueAppointmentStatus[value];
  }
}
