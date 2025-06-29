import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../../../services/api.service';
import { ApiResponse } from '../../../../types/ApiResponse';
import { IProviderViewModel } from '../../../../types/IProviderViewModel';
import { IProviderAssignmentViewModel } from '../../../../types/IProviderAssignmentViewModel';
import { IShiftViewModel } from '../../../../types/IShiftViewModel';
import { AssignmentType } from '../../../../Enums/AssignmentType.enum';
import { ShiftType } from '../../../../Enums/ShiftType.enum';


@Component({
  selector: 'app-manually-schedule',
  templateUrl: './manually-schedule.component.html',
  styleUrls: ['./manually-schedule.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class ManuallyScheduleComponent implements OnInit {
  provider: IProviderViewModel | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  scheduleForm: FormGroup;
  centerId: number = 1;
  dateOptions: Date[] = [];
  viewDate: Date = new Date();
  assignments: { startDate: Date; endDate: Date }[] = [];
  daysInMonth: { date: Date | null; hasAssignment: boolean }[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.scheduleForm = this.fb.group({
      Shifts: this.fb.array([]),
    });

    this.viewDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    const providerId = this.route.snapshot.paramMap.get('id');
    if (providerId && providerId.trim() !== '') {
      this.loadProviderDetails(providerId);
      this.loadAssignments(providerId);
    } else {
      this.errorMessage = 'Provider ID not found.';
      this.updateCalendar();
    }

    this.addShift();
  }

  loadProviderDetails(providerId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProviderById(providerId).subscribe({
      next: (response: ApiResponse<IProviderViewModel>) => {
        this.isLoading = false;
        if (response.Status === 200 && response.Data) {
          this.provider = response.Data;
          console.log('Provider details loaded:', this.provider);
        } else {
          this.errorMessage =
            response.Message || 'Failed to load provider details.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading provider details.';
        console.error('API error:', err);
        this.cdr.detectChanges();
      },
    });
  }

  loadAssignments(providerId: string): void {
    this.isLoading = true;
    // Clear error message to ensure the page renders even if there are no assignments
    this.errorMessage = '';

    this.apiService
      .getAllProviderAssignments(providerId)
      .subscribe({
        next: (response: ApiResponse<any[]>) => {
          this.isLoading = false;
          console.log('API response for assignments:', response);
          if (
            response.Status === 200 &&
            response.Data &&
            response.Data.length > 0
          ) {
            this.assignments = response.Data.map((item) => {
              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);
              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(0, 0, 0, 0);
              console.log('Parsed assignment range:', { startDate, endDate });
              return { startDate, endDate };
            }).filter(
              (range) =>
                !isNaN(range.startDate.getTime()) &&
                !isNaN(range.endDate.getTime())
            );
            console.log('Assignments array after mapping:', this.assignments);
          } else {
            // No assignments found or empty data, treat as a normal case
            this.assignments = [];
            console.log(
              'No assignments found, assignments set to:',
              this.assignments
            );
          }
          this.updateCalendar();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          // Only set an error message for unexpected errors (e.g., network issues, server errors)
          if (err.status !== 404) {
            this.errorMessage = 'An error occurred while loading assignments.';
            console.error('Assignment load error:', err);
          } else {
            // 404 means no assignments, which is a valid case
            this.assignments = [];
            console.log(
              'No assignments found (404), assignments set to:',
              this.assignments
            );
          }
          this.updateCalendar();
          this.cdr.detectChanges();
        },
      });
  }

  private updateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    console.log('Starting day:', startingDay, 'Days in month:', daysInMonth);

    for (let i = 0; i < startingDay; i++) {
      this.daysInMonth.push({ date: null, hasAssignment: false });
      console.log('Added padding day at index:', i);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);
      const hasAssignment = this.assignments.some((assignment) => {
        const start = new Date(assignment.startDate);
        const end = new Date(assignment.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        console.log(
          `Checking day ${currentDate.toISOString().split('T')[0]} against ${
            start.toISOString().split('T')[0]
          } to ${end.toISOString().split('T')[0]}`
        );
        return currentDate >= start && currentDate <= end;
      });
      this.daysInMonth.push({ date: currentDate, hasAssignment });
      console.log(`Added day ${day}, hasAssignment: ${hasAssignment}`);
    }

    console.log('Final daysInMonth array:', this.daysInMonth);
    this.updateDateOptions();
  }

  get shifts(): FormArray {
    return this.scheduleForm.get('Shifts') as FormArray;
  }

  addShift(): void {
    const shiftGroup = this.fb.group({
      Date: [this.dateOptions[0] || null, Validators.required],
      StartTime: ['', Validators.required],
      EndTime: ['', Validators.required],
      MaxPatientsPerDay: [null, [Validators.min(1)]],
    });
    this.shifts.push(shiftGroup);
  }

  removeShift(index: number): void {
    this.shifts.removeAt(index);
  }

  updateDateOptions(): void {
    this.dateOptions = [];

    if (this.selectedStartDate && this.selectedEndDate) {
      let currentDate = new Date(this.selectedStartDate);
      while (currentDate <= this.selectedEndDate) {
        this.dateOptions.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else if (this.selectedStartDate) {
      this.dateOptions.push(new Date(this.selectedStartDate));
    }

    this.shifts.controls.forEach((control, index) => {
      const dateControl = control.get('Date');
      if (dateControl && this.dateOptions.length > 0) {
        dateControl.setValue(this.dateOptions[0]);
        dateControl.updateValueAndValidity();
      }
    });
  }

  private formatDateToString(date: Date | string | null): string {
    if (!date) return '';
    if (typeof date === 'string') {
      return date;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTimeToString(time: string): string {
    return time ? `${time}:00` : '';
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.provider) {
      this.errorMessage = 'Provider details not loaded.';
      return;
    }

    if (!this.selectedStartDate) {
      this.errorMessage = 'Please select a start date.';
      return;
    }

    const formValue: any = this.scheduleForm.value;
    const model: IProviderAssignmentViewModel = {
      ProviderId: this.provider.ProviderId,
      CenterId: this.centerId,
      StartDate: this.formatDateToString(this.selectedStartDate) || null,
      EndDate: this.formatDateToString(this.selectedEndDate) || null,
      AssignmentType: AssignmentType.Visiting,
      Shifts: formValue.Shifts.map(
        (shift: any): IShiftViewModel => ({
          ShiftType: ShiftType.None,
          ShiftDate: this.formatDateToString(shift.Date),
          StartTime: this.formatTimeToString(shift.StartTime),
          EndTime: this.formatTimeToString(shift.EndTime),
          MaxPatientsPerDay: shift.MaxPatientsPerDay,
          OperatorId: 'user1-operator',
        })
      ),
    };

    console.log('Sending payload to API:', JSON.stringify(model, null, 2));

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.assignProviderToCenterManually(model).subscribe({
      next: (response: ApiResponse<string>) => {
        this.isLoading = false;
        if (response.Status === 200) {
          this.successMessage =
            response.Data || 'Provider scheduled successfully!';
          this.scheduleForm.reset();
          this.shifts.clear();
          this.selectedStartDate = null;
          this.selectedEndDate = null;
          this.dateOptions = [];
          this.loadAssignments(this.provider!.ProviderId);
          this.addShift();
        } else {
          this.errorMessage =
            response.Message ||
            'Failed to schedule provider. Status: ' + response.Status;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `An error occurred while scheduling the provider. Status: ${
          err.status || 'Unknown'
        } - ${err.message || err.error?.message || 'No additional details'}`;
        console.error('API error:', err);
      },
    });
  }

  selectDate(day: { date: Date | null; hasAssignment: boolean }): void {
    if (!day.date || day.hasAssignment) return;

    if (!this.selectedStartDate) {
      this.selectedStartDate = new Date(day.date);
      this.selectedStartDate.setHours(0, 0, 0, 0);
    } else if (!this.selectedEndDate) {
      const potentialEndDate = new Date(day.date);
      potentialEndDate.setHours(0, 0, 0, 0);
      if (potentialEndDate > this.selectedStartDate) {
        this.selectedEndDate = potentialEndDate;
      } else {
        this.selectedStartDate = potentialEndDate;
        this.selectedEndDate = null;
      }
    } else {
      this.selectedStartDate = new Date(day.date);
      this.selectedStartDate.setHours(0, 0, 0, 0);
      this.selectedEndDate = null;
    }

    this.updateDateOptions();
    this.cdr.detectChanges();
  }

  nextMonth(): void {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() + 1,
      1
    );
    this.loadAssignments(this.route.snapshot.paramMap.get('id') || '');
  }

  prevMonth(): void {
    this.viewDate = new Date(
      this.viewDate.getFullYear(),
      this.viewDate.getMonth() - 1,
      1
    );
    this.loadAssignments(this.route.snapshot.paramMap.get('id') || '');
  }

  getMonthName(): string {
    return this.viewDate.toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  isSelectedStartDate(date: Date | null): boolean {
    if (!date || !this.selectedStartDate) return false;
    return date.getTime() === this.selectedStartDate.getTime();
  }

  isSelectedEndDate(date: Date | null): boolean {
    if (!date || !this.selectedEndDate) return false;
    return date.getTime() === this.selectedEndDate.getTime();
  }

  isInBetweenDate(date: Date | null): boolean {
    if (!date || !this.selectedStartDate || !this.selectedEndDate) return false;
    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    return (
      currentDate > this.selectedStartDate && currentDate < this.selectedEndDate
    );
  }

  ManuallySchedule(): void {
    this.router.navigate([
      'owner/manually-schedule',
      this.route.snapshot.paramMap.get('id'),
    ]);
  }

  WeeklySchedule(): void {
    this.router.navigate([
      'owner/weekly-schedule',
      this.route.snapshot.paramMap.get('id'),
    ]);
  }

  goBack(): void {
    this.router.navigate(['/provider-management']);
  }
}
