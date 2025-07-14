import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../../services/api.service';
import { OwnerService } from '../../services/owner.service';
import { AuthService } from '../../../../services/auth.service';
import { ICenterStatistics } from '../../../../types/ICenterStatistics';
import { ICenterAssignments } from '../../../../types/ICenterAssignments';
import { ICenterShifts } from '../../models/ICenterShifts';
import { ApiResponse } from '../../../../types/ApiResponse';

@Component({
  selector: 'app-center-dashboard',
  templateUrl: './center-dashboard.component.html',
  styleUrls: ['./center-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ]
})
export class CenterDashboardComponent implements OnInit {
  statistics: ICenterStatistics | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  centerId: number = 0;
  viewDate: Date = new Date();
  daysInMonth: { date: Date | null; hasAssignment: boolean; assignments: { assignmentId: number; startDate: string; endDate: string | null }[] }[] = [];
  assignments: ICenterAssignments[] = [];
  centerShifts: ICenterShifts[] = [];

  constructor(
    private apiService: ApiService,
    private ownerService: OwnerService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.centerId = this.authService.getCenterId();
    this.initializeCalendar();
    this.loadStatistics();
    this.loadAllAssignments();
    this.loadAllCenterShifts();
  }

  loadStatistics(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.statistics = null;

    this.apiService.getCenterStatistics(this.centerId).subscribe({
      next: (response) => {
        if (response.Status === 200 && response.Data) {
          this.statistics = response.Data;
          this.errorMessage = '';
        } else {
          this.handleError(response.Message || 'Failed to load statistics.');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('An error occurred while loading statistics. Please try again later.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  initializeCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonthCount = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];

    for (let i = 0; i < startingDay; i++) {
      this.daysInMonth.push({ date: null, hasAssignment: false, assignments: [] });
    }

    for (let day = 1; day <= daysInMonthCount; day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);
      this.daysInMonth.push({ date: currentDate, hasAssignment: false, assignments: [] });
    }

    const totalDays = this.daysInMonth.length;
    const remainingDays = 42 - totalDays;
    for (let i = 0; i < remainingDays; i++) {
      this.daysInMonth.push({ date: null, hasAssignment: false, assignments: [] });
    }
  }

  loadAllAssignments(): void {
    this.isLoading = true;
    this.ownerService.getCenterAssignments(this.centerId).subscribe({
      next: (response: ApiResponse<ICenterAssignments[]>) => {
        console.log('Assignments response:', response);
        if (response.Status === 200 && Array.isArray(response.Data)) {
          this.assignments = response.Data.map(assignment => {
            const startDate = new Date(assignment.StartDate);
            const endDate = assignment.EndDate ? new Date(assignment.EndDate) : null;
            if (isNaN(startDate.getTime())) {
              console.error(`Invalid StartDate for AssignmentId ${assignment.AssignmentId}: ${assignment.StartDate}`);
            }
            if (endDate && isNaN(endDate.getTime())) {
              console.error(`Invalid EndDate for AssignmentId ${assignment.AssignmentId}: ${assignment.EndDate}`);
            }
            return {
              ...assignment,
              StartDate: startDate,
              EndDate: endDate
            };
          }).filter(assignment => !isNaN(assignment.StartDate.getTime()));
          console.log('Processed assignments:', this.assignments);
          this.updateCalendar();
        } else {
          console.error('Invalid assignments response:', response);
          this.handleError(response.Message || 'Invalid assignments data received from server.');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching assignments:', err);
        this.handleError('An error occurred while loading assignments: ' + (err.message || 'Unknown error'));
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

    loadAllCenterShifts(): void {
    this.isLoading = true;
    this.ownerService.getAllCenterShifts(this.centerId).subscribe({
      next: (response: ApiResponse<ICenterShifts[]>) => {
        console.log('Shifts response:', response);
        if (response.Status === 200 && Array.isArray(response.Data)) {
          this.centerShifts = response.Data.map(shift => {
            const shiftDate = new Date(shift.ShiftDate);

                        // Handle time strings (e.g., "09:00:00", "21:00:00")
            let startTime: Date;
            let endTime: Date;

            // Handle StartTime
            if (typeof shift.StartTime === 'string') {
              // If it's a time string, create a date object with today's date and the time
              const today = new Date();
              const timeString = shift.StartTime as string;
              const [hours, minutes, seconds] = timeString.split(':').map(Number);
              startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds || 0);
            } else {
              startTime = new Date(shift.StartTime);
            }

            // Handle EndTime
            if (typeof shift.EndTime === 'string') {
              // If it's a time string, create a date object with today's date and the time
              const today = new Date();
              const timeString = shift.EndTime as string;
              const [hours, minutes, seconds] = timeString.split(':').map(Number);
              endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds || 0);
            } else {
              endTime = new Date(shift.EndTime);
            }

            if (isNaN(shiftDate.getTime())) {
              console.error(`Invalid ShiftDate for ShiftId ${shift.ShiftId}: ${shift.ShiftDate}`);
            }
            if (isNaN(startTime.getTime())) {
              console.error(`Invalid StartTime for ShiftId ${shift.ShiftId}: ${shift.StartTime}`);
            }
            if (isNaN(endTime.getTime())) {
              console.error(`Invalid EndTime for ShiftId ${shift.ShiftId}: ${shift.EndTime}`);
            }

            return {
              ...shift,
              ShiftDate: shiftDate,
              StartTime: startTime,
              EndTime: endTime
            };
          }).filter(shift => !isNaN(shift.ShiftDate.getTime()) && !isNaN(shift.StartTime.getTime()) && !isNaN(shift.EndTime.getTime()));
          console.log('Processed shifts:', this.centerShifts);
        } else {
          console.error('Invalid shifts response:', response);
          this.handleError(response.Message || 'Invalid shifts data received from server.');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching shifts:', err);
        this.handleError('An error occurred while loading shifts: ' + (err.message || 'Unknown error'));
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    this.daysInMonth.forEach(day => {
      if (day.date) {
        const currentDate = day.date;
        const isCurrentMonth = currentDate.getMonth() === month && currentDate.getFullYear() === year;
        if (isCurrentMonth) {
          const matchingAssignments = this.assignments.filter(assignment => {
            const startDate = new Date(assignment.StartDate);
            const endDate = assignment.EndDate ? new Date(assignment.EndDate) : null;
            startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            // Check if current date falls within the assignment range (inclusive)
            if (endDate) {
              return currentDate.getTime() >= startDate.getTime() && currentDate.getTime() <= endDate.getTime();
            } else {
              // If no end date, only check if it matches the start date
              return currentDate.getTime() === startDate.getTime();
            }
          }).map(assignment => ({
            assignmentId: assignment.AssignmentId,
            startDate: new Date(assignment.StartDate).toLocaleDateString(),
            endDate: assignment.EndDate ? new Date(assignment.EndDate).toLocaleDateString() : null
          }));
          day.hasAssignment = matchingAssignments.length > 0;
          day.assignments = matchingAssignments;
          if (day.hasAssignment) {
            console.log(`Day ${currentDate.toLocaleDateString()} has assignments:`, matchingAssignments);
          }
        }
      }
    });
    this.cdr.detectChanges();
    console.log('Updated daysInMonth:', this.daysInMonth);
  }



  nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.initializeCalendar();
    this.assignments = [];
    this.loadAllAssignments();
  }

  prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.initializeCalendar();
    this.assignments = [];
    this.loadAllAssignments();
  }

  getMonthName(): string {
    return this.viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  }

  handleError(message: string): void {
    this.errorMessage = message;
    this.statistics = null;
    this.cdr.detectChanges();
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

}
