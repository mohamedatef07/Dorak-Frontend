import { ICenterShifts } from './../../models/ICenterShifts';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-center-shifts-table',
  imports: [
    TimeStringToDatePipe,
    DatePipe,
    ConfirmPopupModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './center-shifts-table.component.html',
  styleUrl: './center-shifts-table.component.css',
})
export class CenterShiftsTableComponent {
  messageServices = inject(MessageService);
  ownerServices = inject(OwnerService);
  confirmService = inject(ConfirmationService);
  route = inject(Router);
  centerShifts!: Array<ICenterShifts>;
  centerId = 1;

  ngOnInit() {
    this.ownerServices.getAllCenterShifts(this.centerId).subscribe({
      next: (res) => {
        this.centerShifts = [...res.Data];
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
  startShift(shiftId: number) {
    this.ownerServices.startShift(shiftId).subscribe({
      next: (res) => {
        this.route.navigate(['live-queue']);
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
  cancelShift(shiftId: number, event: Event) {
    this.confirmService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to cancel this shift?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ownerServices.cancelShift(shiftId).subscribe({
          next: (res) => {
            console.log(res);
          },
          error: (err) => {
            this.messageServices.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'The server is experiencing an issue, Please try again soon.',
              life: 4000,
            });
          },
        });
      },
    });
  }
  shiftDetails(shiftId: number) {
    this.route.navigate(['shift-appointments']);
  }
}
