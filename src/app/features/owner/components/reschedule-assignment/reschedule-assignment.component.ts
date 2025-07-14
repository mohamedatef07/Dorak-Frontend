import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../../../services/api.service';
import { ApiResponse } from '../../../../types/ApiResponse';
import { IRescheduleAssignmentViewModel } from '../../../../types/IRescheduleAssignmentViewModel';
import { IProviderViewModel } from '../../../../types/IProviderViewModel';
import { IShiftViewModel } from '../../../../types/IShiftViewModel';
import { AssignmentType } from '../../../../Enums/AssignmentType.enum';
import { ShiftType } from '../../../../Enums/ShiftType.enum';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-reschedule-assignment',
  templateUrl: './reschedule-assignment.component.html',
  styleUrls: ['./reschedule-assignment.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
})
export class RescheduleAssignmentComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  scheduleForm: FormGroup;
  centerId: number = 0;
  operatorId: string = '0';
  providerId: string = '';
  providerName: string = '';
  providerSpecialization: string = '';

  daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];
  viewDate: Date = new Date();
  daysInMonth: { date: Date | null }[] = [];
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  dateOptions: Date[] = [];
  isWeeklyMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.scheduleForm = this.fb.group({
      assignments: this.fb.array([this.createAssignmentGroup()]),
    });
    this.viewDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.operatorId = this.authService.getUserId();
    this.centerId = this.authService.getCenterId();
    this.route.paramMap.pipe(
      switchMap(params => {
        this.providerId = params.get('id') || '';
        if (!this.providerId) {
          this.errorMessage = 'Provider ID not found.';
          this.updateCalendar();
          return of([]);
        }
        return this.apiService.getProviderById(this.providerId).pipe(
          map((response: ApiResponse<IProviderViewModel>) => {
            if (response.Status === 200 && response.Data) {
              this.providerName = response.Data.FirstName + " " + response.Data.LastName || 'Unknown Provider';
              this.providerSpecialization = response.Data.Specialization || 'Unknown Specialization';
            } else {
              this.errorMessage = response.Message || 'Failed to fetch provider details.';
            }
            this.updateCalendar();
            return [];
          }),
          catchError(error => {
            this.errorMessage = 'Error fetching provider details: ' + error.message;
            console.error('API error:', error);
            this.updateCalendar();
            return of([]);
          })
        );
      })
    ).subscribe();
  }

  private updateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    for (let i = 0; i < startingDay; i++) {
      this.daysInMonth.push({ date: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);
      this.daysInMonth.push({ date: currentDate });
    }
    this.cdr.detectChanges();
  }

  get assignmentsArray(): FormArray {
    return this.scheduleForm.get('assignments') as FormArray;
  }

  createAssignmentGroup(): FormGroup {
    return this.fb.group({
      WorkingDays: [[]],
      Shifts: this.fb.array([this.createShiftGroup()]),
    }, { validators: this.isWeeklyMode ? this.workingDaysValidator : null });
  }

  createShiftGroup(date: Date | null = null): FormGroup {
    return this.fb.group({
      Date: [date || this.dateOptions[0] || null, this.isWeeklyMode ? [] : [Validators.required]],
      StartTime: ['', Validators.required],
      EndTime: ['', Validators.required],
      MaxPatientsPerDay: [null, [Validators.min(1)]],
    });
  }

  addAssignment(): void {
    this.assignmentsArray.push(this.createAssignmentGroup());
  }

  removeAssignment(index: number): void {
    if (this.assignmentsArray.length > 1) {
      this.assignmentsArray.removeAt(index);
    }
  }

  getShifts(assignmentIndex: number): FormArray {
    return this.assignmentsArray.at(assignmentIndex).get('Shifts') as FormArray;
  }

  addShift(assignmentIndex: number): void {
    const shifts = this.getShifts(assignmentIndex);
    const dateToAssign = this.dateOptions.length > 0 ? this.dateOptions[shifts.length % this.dateOptions.length] : null;
    shifts.push(this.createShiftGroup(dateToAssign));
    this.cdr.detectChanges();
  }

  removeShift(assignmentIndex: number, shiftIndex: number): void {
    const shifts = this.getShifts(assignmentIndex);
    if (shifts.length > 1) {
      shifts.removeAt(shiftIndex);
    }
  }

  workingDaysValidator(group: FormGroup): { [key: string]: any } | null {
    const workingDays = group.get('WorkingDays')?.value as number[];
    return (!workingDays || workingDays.length === 0) ? { noWorkingDays: true } : null;
  }

  onWorkingDayChange(dayValue: number, isChecked: boolean, assignmentIndex: number): void {
    const assignment = this.assignmentsArray.at(assignmentIndex) as FormGroup;
    let workingDays: number[] = assignment.get('WorkingDays')?.value || [];
    if (isChecked) {
      if (!workingDays.includes(dayValue)) workingDays.push(dayValue);
    } else {
      workingDays = workingDays.filter(day => day !== dayValue);
    }
    assignment.get('WorkingDays')?.setValue(workingDays);
    assignment.get('WorkingDays')?.updateValueAndValidity();
  }

  isWorkingDaySelected(dayValue: number, assignmentIndex: number): boolean {
    const assignment = this.assignmentsArray.at(assignmentIndex) as FormGroup;
    const workingDays = assignment.get('WorkingDays')?.value as number[];
    return workingDays.includes(dayValue);
  }

  selectDate(day: { date: Date | null }): void {
    if (!day.date) return;
    if (this.isWeeklyMode) {
      this.selectedStartDate = new Date(day.date);
      this.selectedStartDate.setHours(0, 0, 0, 0);
    } else {
      if (!this.selectedStartDate) {
        this.selectedStartDate = new Date(day.date);
        this.selectedStartDate.setHours(0, 0, 0, 0);
      } else if (!this.selectedEndDate) {
        const potentialEndDate = new Date(day.date);
        potentialEndDate.setHours(0, 0, 0, 0);
        if (potentialEndDate > this.selectedStartDate) this.selectedEndDate = potentialEndDate;
        else {
          this.selectedStartDate = potentialEndDate;
          this.selectedEndDate = null;
        }
      } else {
        this.selectedStartDate = new Date(day.date);
        this.selectedStartDate.setHours(0, 0, 0, 0);
        this.selectedEndDate = null;
      }
      this.updateDateOptions();
    }
    this.cdr.detectChanges();
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
    this.assignmentsArray.controls.forEach((assignment, index) => {
      const shifts = this.getShifts(index);
      shifts.controls.forEach((shift, j) => {
        const dateControl = shift.get('Date');
        if (dateControl && this.dateOptions.length > 0) {
          if (!dateControl.value) {
            dateControl.setValue(this.dateOptions[j % this.dateOptions.length]);
          }
        }
      });
    });
  }

  private formatDateToString(date: Date | string | null): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTimeToString(time: string): string {
    return time ? `${time}:00` : '';
  }

  private generateShiftDates(startDate: Date, workingDays: number[]): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return dates;
    const endDate = new Date(start);
    endDate.setDate(start.getDate() + 27);
    let currentDate = new Date(start);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (workingDays.includes(dayOfWeek)) dates.push(this.formatDateToString(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    if (!this.selectedStartDate) {
      this.errorMessage = 'Please select a start date.';
      return;
    }

    const formValue = this.scheduleForm.value;
    const models: IRescheduleAssignmentViewModel[] = formValue.assignments.map((assignment: any, assignmentIndex: number) => {
      const startDate = this.formatDateToString(this.selectedStartDate!);
      const endDate = !this.isWeeklyMode && this.selectedEndDate ? this.formatDateToString(this.selectedEndDate) : null;
      const workingDays = this.isWeeklyMode ? (assignment.WorkingDays.length > 0 ? assignment.WorkingDays : undefined) : undefined;

      let shifts: IShiftViewModel[] = [];
      if (this.isWeeklyMode) {
        const dates = this.generateShiftDates(this.selectedStartDate!, assignment.WorkingDays || []);
        shifts = dates.flatMap(dateStr => {
          const date = new Date(dateStr);
          return this.getShifts(assignmentIndex).controls.map((shift: any) => ({
            ShiftType: ShiftType.None,
            ShiftDate: this.formatDateToString(date),
            StartTime: this.formatTimeToString(shift.get('StartTime').value),
            EndTime: this.formatTimeToString(shift.get('EndTime').value),
            MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
            OperatorId: this.operatorId
          }));
        });
      } else {
        shifts = this.getShifts(assignmentIndex).controls.map((shift: any) => {
          const shiftDate = shift.get('Date').value;
          if (!shiftDate) {
            console.warn('Shift missing date, using first available date:', this.dateOptions[0]);
            return {
              ShiftType: ShiftType.None,
              ShiftDate: this.formatDateToString(this.dateOptions[0]),
              StartTime: this.formatTimeToString(shift.get('StartTime').value),
              EndTime: this.formatTimeToString(shift.get('EndTime').value),
              MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
              OperatorId: this.operatorId,
            };
          }
          return {
            ShiftType: ShiftType.None,
            ShiftDate: this.formatDateToString(shift.get('Date').value),
            StartTime: this.formatTimeToString(shift.get('StartTime').value),
            EndTime: this.formatTimeToString(shift.get('EndTime').value),
            MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
            OperatorId: this.operatorId,
          };
        });
      }

      return {
        ProviderId: this.providerId,
        CenterId: this.centerId,
        StartDate: startDate,
        EndDate: endDate,
        AssignmentType: this.isWeeklyMode ? AssignmentType.Permanent : AssignmentType.Visiting,
        WorkingDays: workingDays,
        Shifts: shifts,
      };
    });

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    models.forEach(model => {
      this.apiService.rescheduleAssignment(model).subscribe({
        next: (response: ApiResponse<string>) => {
          this.isLoading = false;
          if (response.Status === 200) {
            this.successMessage = response.Data || 'Assignments rescheduled successfully!';
            this.scheduleForm.reset();
            this.assignmentsArray.clear();
            this.addAssignment();
            this.selectedStartDate = null;
            this.selectedEndDate = null;
            this.dateOptions = [];
          } else {
            this.errorMessage = response.Message || 'Failed to reschedule assignments.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = `An error occurred while rescheduling. Status: ${err.status || 'Unknown'} - ${err.message || 'No additional details'}`;
          console.error('API error:', err);
          this.cdr.detectChanges();
        },
      });
    });
  }

  toggleMode(): void {
    this.isWeeklyMode = !this.isWeeklyMode;
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.dateOptions = [];
    this.assignmentsArray.clear();
    this.assignmentsArray.push(this.createAssignmentGroup());
    this.updateCalendar();
    this.cdr.detectChanges();
  }

  nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.updateCalendar();
  }

  prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.updateCalendar();
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

  isSelectedStartDate(date: Date | null): boolean {
    return !!date && !!this.selectedStartDate && date.getTime() === this.selectedStartDate.getTime();
  }

  isSelectedEndDate(date: Date | null): boolean {
    return !!date && !!this.selectedEndDate && date.getTime() === this.selectedEndDate.getTime();
  }

  isInRange(date: Date | null): boolean {
    if (!date || !this.selectedStartDate || !this.selectedEndDate) return false;
    return date >= this.selectedStartDate && date <= this.selectedEndDate;
  }

  goBack(): void {
    this.router.navigate(['owner/provider-management']);
  }
}
