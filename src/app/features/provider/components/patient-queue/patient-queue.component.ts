import { Component, OnInit } from '@angular/core';
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
  filterPatientTypeValue: string = '';
  filterPatientStatusValue: string = '';

  ngOnInit() {
  }

  onSearchInputChange(searchValue: string) {
    this.globalSearchValue = searchValue;
  }
  onFilterPatientTypeChanged(patientType: string) {
    this.filterPatientTypeValue = patientType;
  }
  onFilterPatientStatusChanged(patientStatus: string) {
    this.filterPatientStatusValue = patientStatus;
  }
}
