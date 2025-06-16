import { ICenterShifts } from './../../models/ICenterShifts';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { ButtonModule } from 'primeng/button';
import { UpdateShiftsListSRService } from '../../../../services/signalR Services/updateShiftsListSR.service';
import { ShiftType } from '../../../../Enums/ShiftType.enum';
@Component({
  selector: 'app-center-shifts-table',
  imports: [TimeStringToDatePipe, DatePipe, ButtonModule, CommonModule],
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
  ShiftType = ShiftType;

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
      next: (updatedList) => {
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
  startShift(shift: ICenterShifts) {
    const shiftDate = new Date(shift.ShiftDate + ' ' + shift.StartTime);
    // if (
    //   shiftDate <= new Date() &&
    //   shiftDate.getDate() === new Date().getDate()
    // )
    {
      this.ownerServices.startShift(shift.ShiftId).subscribe({
        next: (res) => {
          this.route.navigate(['owner/provider-live-queue', shift.ShiftId]);
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
    }
    // else {
    //   this.messageServices.add({
    //     severity: 'info',
    //     summary: 'info',
    //     detail: `This shift isn't ready to start just yet. Please wait for its scheduled time.`,
    //     life: 4000,
    //   });
    // }
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
  formatDate(date: Date): Date {
    if (!date) return new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return new Date(year, month, day, hours, minutes, seconds);
  }
}
