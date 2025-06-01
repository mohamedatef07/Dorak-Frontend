import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { MessageService } from 'primeng/api';
import { IQueueEntries } from '../../models/IQueueEntries';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { ClientTypeEnumValuePipe } from '../../../../pipes/ClientTypeEnumValue.pipe';
import { QueueAppointmentStatusEnumValuePipe } from '../../../../pipes/QueueAppointmentStatusEnumValue.pipe';
import { QueueAppointmentStatus } from '../../../../Enums/QueueAppointmentStatus.enum';

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
}
