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
    ClientTypeEnumValuePipe,
    QueueAppointmentStatusEnumValuePipe,
    CommonModule,
    TimeStringToDatePipe
  ],
})
export class PatientQueueTableComponent implements OnInit {
  providerServices = inject(ProviderService);
  messageServices = inject(MessageService);
  QueueAppointmentStatus = QueueAppointmentStatus;
  allQueueEntries: Array<IQueueEntries> = [];
  filteredQueueEntries: Array<IQueueEntries> = [];
  paginatedQueueEntries: Array<IQueueEntries> = [];
  @Input() searchText: string = '';
  @Input() patientStatus: string = '';
  @Input() patientType: string = '';

  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;


  nextPage() {
    this.currentPage++;
    this.updateDisplayedEntries();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedEntries();
    }
  }

  get canGoNext(): boolean {
    return this.currentPage * this.pageSize < this.totalRecords;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get startRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }
  constructor() {}

  ngOnInit() {
    this.loadQueues();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchText'] || changes['patientStatus'] || changes['patientType']) {
      this.currentPage = 1; // Reset to first page on filter/search change
      this.updateDisplayedEntries();
    }
  }

  updateDisplayedEntries() {
    // 1. Filter by patientStatus
    let entries = [...this.allQueueEntries];
    if (this.patientStatus && this.patientStatus.trim() !== '') {
      entries = entries.filter(
        (entry) => this.getAppointmentStatusValue(entry.Status) === this.patientStatus
      );
    }
    // 2. Filter by patientType
    if (this.patientType && this.patientType.trim() !== '') {
      entries = entries.filter(
        (entry) => this.getClientTypeValue(entry.ClientType) === this.patientType
      );
    }
    // 3. Search by name
    if (this.searchText && this.searchText.trim() !== '') {
      entries = entries.filter((entry) =>
        entry.FullName.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
    this.filteredQueueEntries = entries;
    this.totalRecords = entries.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
    // 4. Paginate
    const startIdx = (this.currentPage - 1) * this.pageSize;
    const endIdx = startIdx + this.pageSize;
    this.paginatedQueueEntries = entries.slice(startIdx, endIdx);
  }

  getClientTypeValue(value: ClientType) {
    return ClientType[value];
  }
  getAppointmentStatusValue(value: QueueAppointmentStatus) {
    return QueueAppointmentStatus[value];
  }
  loadQueues() {
    this.providerServices.getQueueEntries().subscribe({
      next: (res) => {
        this.allQueueEntries = [...res.Data];
        this.currentPage = 1;
        this.updateDisplayedEntries();
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
}
