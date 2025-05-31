import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-patient-queue',
  templateUrl: './patient-queue.component.html',
  styleUrls: ['./patient-queue.component.css'],
})
export class PatientQueueComponent implements OnInit {
  providerServices = inject(ProviderService);
  messageServices = inject(MessageService);

  constructor() {}

  ngOnInit() {
    this.providerServices.getQueueEntries().subscribe({
      next: (res) => {
        console.log(res.Data);
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
