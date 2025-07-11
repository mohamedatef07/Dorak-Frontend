import { ProviderService } from './../../services/provider.service';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IDoctorScheduleDetails } from '../../models/IDoctorScheduleDetails';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { TooltipModule } from 'primeng/tooltip';
import { IShiftDetails } from '../../models/IShiftDetails';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
  imports: [
    DatePipe,
    TimeStringToDatePipe,
    FormsModule,
    DatePickerModule,
    CommonModule,
    TooltipModule,
  ],
  providers: [DatePipe, TimeStringToDatePipe],
})
export class ScheduleComponent implements OnInit {
  providerServices = inject(ProviderService);
  messageServices = inject(MessageService);
  datePipe = inject(DatePipe);
  timeStringToDatePipe = inject(TimeStringToDatePipe);
  scheduleShifts: Array<IDoctorScheduleDetails> = [];
  shiftDetails: IShiftDetails | undefined;
  dateNow = new Date();

  constructor() {}

  getShiftsForDate(date: any): Array<IDoctorScheduleDetails> {
    return this.scheduleShifts.filter(
      (shift) =>
        shift.ShiftDate.getDate() === date.day &&
        shift.ShiftDate.getMonth() === date.month &&
        shift.ShiftDate.getFullYear() === date.year
    );
  }
  getStyle(date: Date): any {
    const hasShifts = this.getShiftsForDate(date).length > 0;
    return hasShifts
      ? {
          backgroundColor: '#f0f7ff',
          borderRadius: '5px',
          padding: '2px',
        }
      : {};
  }
  showShiftDetails(shiftId: number | undefined) {
    this.providerServices.getShiftDetails(shiftId).subscribe({
      next: (res) => {
        this.shiftDetails = res.Data;
        if (this.shiftDetails) {
          const startTime = this.timeStringToDatePipe.transform(
            this.shiftDetails.StartTime.toString()
          );
          const endTime = this.timeStringToDatePipe.transform(
            this.shiftDetails.EndTime.toString()
          );
          this.messageServices.add({
            key: 'main-toast',
            severity: 'info',
            summary: 'Shift Details',
            detail: `
                Start Time:  ${this.datePipe.transform(startTime, 'h:mm a')}
                End Time:  ${this.datePipe.transform(endTime, 'h:mm a')}
                Duration:  ${this.shiftDetails.EstimatedDuration} Min
                Total Appointments:  ${this.shiftDetails.TotalAppointments}
                Approved Appointments:  ${
                  this.shiftDetails.ApprovedAppointments
                }
                Pending Appointments:  ${this.shiftDetails.PendingAppointments}
                  `,
            life: 10000,
          });
        }
      },
      error: (err) => {
        this.messageServices.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }

  ngOnInit() {
    this.providerServices.getDoctorScheduleDetails().subscribe({
      next: (res) => {
        this.scheduleShifts = res.Data.map((shift) => {
          const shiftDate = new Date(shift.ShiftDate);
          return {
            ShiftDate: shiftDate,
            CenterId: shift.CenterId,
            ShiftId: shift.ShiftId,
            ShiftType: shift.ShiftType,
            StartTime: shift.StartTime,
            EndTime: shift.EndTime,
          };
        });
      },
      error: (err) => {
        this.messageServices.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }
}
