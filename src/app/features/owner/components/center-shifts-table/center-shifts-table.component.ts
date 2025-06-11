import { ICenterShifts } from './../../models/ICenterShifts';
import { Component, inject } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { MessageService } from 'primeng/api';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-center-shifts-table',
  imports: [TimeStringToDatePipe, DatePipe],
  templateUrl: './center-shifts-table.component.html',
  styleUrl: './center-shifts-table.component.css',
})
export class CenterShiftsTableComponent {
  messageServices = inject(MessageService);
  ownerServices = inject(OwnerService);
  route = inject(Router);
  centerShifts!: Array<ICenterShifts>;
  ngOnInit() {
    this.ownerServices.getAllCenterShifts(1).subscribe({
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
        console.log(res);
        this.route.navigate(['live-queue']);
      },
    });
  }
  cancelShift(shiftId: number) {
    this.ownerServices.cancelShift(shiftId).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
  shiftDetails(shiftId: number) {}
}
