import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { IProviderViewModel } from '../../../../types/IProviderViewModel';
import { ApiService } from '../../../../services/api.service';
import { ApiResponse } from '../../../../types/ApiResponse';
import { IShift } from '../../../../types/IShift';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule]
})
export class ProviderProfilesComponent implements OnInit {
  provider: IProviderViewModel | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  viewDate: Date = new Date();
  assignments: { startDate: Date; endDate: Date }[] = [];
  daysInMonth: { date: Date | null; hasAssignment: boolean; shifts: { startTime: string; endTime: string }[] }[] = [];
  selectedDate: string = '';

  private providerId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const providerId = this.route.snapshot.paramMap.get('id');
    if (providerId && providerId.trim() !== '') {
      this.providerId = providerId;
      this.initializeCalendar();
      this.loadProviderDetails(this.providerId);
      this.loadAllAssignments(this.providerId);
    } else {
      this.errorMessage = 'Provider ID not found.';
      this.cdr.detectChanges();
    }
  }

  loadProviderDetails(providerId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProviderById(providerId).subscribe({
      next: (response: ApiResponse<IProviderViewModel>) => {
        this.isLoading = false;
        if (response.Status === 200 && response.Data) {
          this.provider = response.Data;
        } else {
          this.errorMessage = response.Message || 'Failed to load provider details.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading provider details. (Status: ' + (err.status || 'Unknown') + ')';
        this.cdr.detectChanges();
      }
    });
  }

  loadAllAssignments(providerId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getAllProviderAssignments(providerId).subscribe({
      next: (response: ApiResponse<any[]>) => {
        this.isLoading = false;
        if (response.Status === 200 && response.Data) {
          this.assignments = response.Data.map(item => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            return { startDate, endDate };
          }).filter(range => !isNaN(range.startDate.getTime()) && !isNaN(range.endDate.getTime()));
          this.loadShiftsForAllAssignments();
        } else {
          this.errorMessage = response.Message || 'No assignments found.';
          this.assignments = [];
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading assignments.';
        this.assignments = [];
        this.cdr.detectChanges();
      }
    });
  }

  private loadShiftsForAllAssignments(): void {
    if (!this.assignments.length) {
      this.updateCalendar();
      return;
    }

    const allDates = this.assignments.flatMap(assignment => this.getDatesInRange(assignment.startDate, assignment.endDate));
    const uniqueDates = [...new Set(allDates.map(d => d.toISOString().split('T')[0]))].map(d => new Date(d));
    const shiftPromises = allDates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      return this.apiService.getAllShifts(date, this.providerId).toPromise();
    });

    Promise.all(shiftPromises).then(responses => {
      allDates.forEach((date, index) => {
        const dateStr = date.toISOString().split('T')[0];
        const response = responses[index];
        if (response && response.Status === 200 && response.Data) {
          const dayIndex = this.daysInMonth.findIndex(d => d.date && d.date.toISOString().split('T')[0] === dateStr);
          if (dayIndex !== -1) {
            const matchingShifts = response.Data.filter((shift: IShift) => {
              const shiftDate = new Date(shift.ShiftDate);
              const isDateMatch =
                shiftDate.getFullYear() === date.getFullYear() &&
                shiftDate.getMonth() === date.getMonth() &&
                shiftDate.getDate() === date.getDate();
              const isProviderMatch = shift.ProviderId === this.providerId;
              return isDateMatch && isProviderMatch;
            }).map((shift: IShift) => ({
              startTime: shift.StartTime,
              endTime: shift.EndTime
            }));
            this.daysInMonth[dayIndex].shifts = matchingShifts;
          }
        }
      });
      this.updateCalendar();
      this.cdr.detectChanges();
    }).catch(err => {
      this.updateCalendar();
      this.cdr.detectChanges();
    });
  }

  private getDatesInRange(start: Date, end: Date): Date[] {
    const dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  private initializeCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonthCount = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];

    for (let i = 0; i < startingDay; i++) {
      this.daysInMonth.push({ date: null, hasAssignment: false, shifts: [] });
    }

    for (let day = 1; day <= daysInMonthCount; day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);
      this.daysInMonth.push({ date: currentDate, hasAssignment: false, shifts: [] });
    }

    const totalDays = this.daysInMonth.length;
    const remainingDays = 42 - totalDays;
    for (let i = 0; i < remainingDays; i++) {
      this.daysInMonth.push({ date: null, hasAssignment: false, shifts: [] });
    }
  }

  private updateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    this.daysInMonth.forEach(day => {
      if (day.date) {
        const currentDate = new Date(day.date);
        currentDate.setHours(0, 0, 0, 0);
        const isCurrentMonth = currentDate.getMonth() === month && currentDate.getFullYear() === year;
        if (isCurrentMonth) {
          day.hasAssignment = this.assignments.some(a => {
            const start = new Date(a.startDate);
            const end = new Date(a.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return currentDate >= start && currentDate <= end;
          });
          console.log(`Day ${currentDate.toDateString()}: hasAssignment = ${day.hasAssignment}`);
        }
      }
    });
  }

   getShiftTooltip(day: { shifts: { startTime: string; endTime: string }[] }): string {
    return day.shifts.map((s, index) => `Shift ${index + 1}: ${"\n"} Start time: ${new Date(`2000-01-01 ${s.startTime} ${"\n"}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}\nEnd time: ${new Date(`2000-01-01 ${s.endTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`).join('\n') || 'No shifts';
  }


  schedule(): void {
this.router.navigate([
      'owner/manually-schedule',
      this.route.snapshot.paramMap.get('id'),
    ]);
  }

  onDateChange(): void {
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['owner/search-provider']);
  }

  nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.initializeCalendar();
    this.loadAllAssignments(this.providerId);
  }

  prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.initializeCalendar();
    this.loadAllAssignments(this.providerId);
  }

  getMonthName(): string {
    return this.viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }
}
