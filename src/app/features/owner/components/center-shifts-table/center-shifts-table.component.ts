import { ICenterShifts } from './../../models/ICenterShifts';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { UpdateShiftsListSRService } from '../../../../services/signalR Services/updateShiftsListSR.service';
@Component({
  selector: 'app-center-shifts-table',
  imports: [TimeStringToDatePipe, DatePipe, ButtonModule],
  templateUrl: './center-shifts-table.component.html',
  styleUrl: './center-shifts-table.component.css',
})
export class CenterShiftsTableComponent {
  messageServices = inject(MessageService);
  ownerServices = inject(OwnerService);
  confirmService = inject(ConfirmationService);
  srService = inject(UpdateShiftsListSRService);
  route = inject(Router);
  centerShifts: Array<ICenterShifts> = [];
  centerId = 1;
  currentTime = new Date();

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
    this.srService.updatedShiftsList.subscribe({
      next: (updatedList: Array<ICenterShifts>) => {
        this.centerShifts = [...updatedList];
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
        this.ownerServices.cancelShift(shiftId, this.centerId).subscribe({
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
  isTimePassed(shift: ICenterShifts): boolean {
    return (
      shift.StartTime.getTime()>= this.currentTime.getTime() &&
      shift.ShiftDate.getDate() === this.currentTime.getDate()
    );
  }
}
