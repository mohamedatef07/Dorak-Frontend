import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ClientType } from '../../../../Enums/ClientType.enum';
import { QueueAppointmentStatus } from '../../../../Enums/QueueAppointmentStatus.enum';
@Component({
  selector: 'app-patient-queue-filter',
  templateUrl: './patient-queue-filter.component.html',
  styleUrls: ['./patient-queue-filter.component.css'],
  imports: [SelectModule, FormsModule],
})
export class PatientQueueFilterComponent implements OnInit {
  selectedPatientType = '';
  selectedPatientStatus = '';
  @Output() filterPatientTypeChanged = new EventEmitter();
  @Output() filterPatientStatusChanged = new EventEmitter();
  PatientTypes: Array<string> = Object.values(ClientType).filter(
    (value) => typeof value === 'string' && value !== 'None'
  ) as string[];
  PatientStatus: Array<string> = Object.values(QueueAppointmentStatus).filter(
    (value) => typeof value === 'string' && value !== 'None'
  ) as string[];

  constructor() {}

  ngOnInit() {}
  filterQueueEntries() {
    this.filterPatientTypeChanged.emit(this.selectedPatientType);
    this.filterPatientStatusChanged.emit(this.selectedPatientStatus);
  }
  resetFilter() {
    this.filterPatientTypeChanged.emit('');
    this.filterPatientStatusChanged.emit('');
  }
}
