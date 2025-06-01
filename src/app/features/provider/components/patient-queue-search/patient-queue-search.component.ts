import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-queue-search',
  templateUrl: './patient-queue-search.component.html',
  styleUrls: ['./patient-queue-search.component.css'],
  imports: [FormsModule],
})
export class PatientQueueSearchComponent implements OnInit {
  searchValue: string = '';
  @Output() searchChanged = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}
  onSearchClick() {
    this.searchChanged.emit(this.searchValue);
  }
}
