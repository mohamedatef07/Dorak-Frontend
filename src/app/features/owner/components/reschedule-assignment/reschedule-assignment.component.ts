// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   FormGroup,
//   FormArray,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { ApiService } from '../../../../services/api.service';
// import { ApiResponse } from '../../../../types/ApiResponse';
// import { IRescheduleAssignmentViewModel } from '../../../../types/IRescheduleAssignmentViewModel';
// import { IShiftViewModel } from '../../../../types/IShiftViewModel';
// import { AssignmentType } from '../../../../Enums/AssignmentType.enum';
// import { ShiftType } from '../../../../Enums/ShiftType.enum';
// import { switchMap } from 'rxjs/operators';

// @Component({
//   selector: 'app-reschedule-assignment',
//   templateUrl: './reschedule-assignment.component.html',
//   styleUrls: ['./reschedule-assignment.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatCheckboxModule,
//   ],
// })
// export class RescheduleAssignmentComponent implements OnInit {
//   errorMessage: string = '';
//   successMessage: string = '';
//   isLoading: boolean = false;
//   scheduleForm: FormGroup;
//   centerId: number = 3;
//   providerId: string = '';
//   daysOfWeek = [
//     { value: 0, label: 'Sunday' },
//     { value: 1, label: 'Monday' },
//     { value: 2, label: 'Tuesday' },
//     { value: 3, label: 'Wednesday' },
//     { value: 4, label: 'Thursday' },
//     { value: 5, label: 'Friday' },
//     { value: 6, label: 'Saturday' },
//   ];
//   viewDate: Date = new Date();
//   daysInMonth: { date: Date | null }[] = [];
//   selectedStartDate: Date | null = null;
//   selectedEndDate: Date | null = null;
//   dateOptions: Date[] = [];
//   isWeeklyMode: boolean = false;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private apiService: ApiService,
//     private fb: FormBuilder,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.scheduleForm = this.fb.group({
//       assignments: this.fb.array([this.createAssignmentGroup()]),
//     });
//     this.viewDate.setHours(0, 0, 0, 0);
//   }

//   ngOnInit(): void {
//     this.route.paramMap.pipe(
//       switchMap(params => {
//         this.providerId = params.get('id') || '';
//         console.log('Retrieved providerId:', this.providerId);
//         if (!this.providerId) {
//           this.errorMessage = 'Provider ID not found.';
//         }
//         this.updateCalendar();
//         return [];
//       })
//     ).subscribe();
//   }

//   private updateCalendar(): void {
//     const year = this.viewDate.getFullYear();
//     const month = this.viewDate.getMonth();
//     const firstDayOfMonth = new Date(year, month, 1);
//     const startingDay = firstDayOfMonth.getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     this.daysInMonth = [];
//     for (let i = 0; i < startingDay; i++) {
//       this.daysInMonth.push({ date: null });
//     }
//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = new Date(year, month, day);
//       currentDate.setHours(0, 0, 0, 0);
//       this.daysInMonth.push({ date: currentDate });
//     }
//     this.cdr.detectChanges();
//   }

//   get assignmentsArray(): FormArray {
//     return this.scheduleForm.get('assignments') as FormArray;
//   }

//   createAssignmentGroup(): FormGroup {
//     return this.fb.group({
//       WorkingDays: [[]],
//       Shifts: this.fb.array([this.createShiftGroup()]),
//     }, { validators: this.isWeeklyMode ? this.workingDaysValidator : null });
//   }

//   createShiftGroup(date: Date | null = null): FormGroup {
//     return this.fb.group({
//       Date: [date || this.dateOptions[0] || null, this.isWeeklyMode ? [] : [Validators.required]],
//       StartTime: ['', Validators.required],
//       EndTime: ['', Validators.required],
//       MaxPatientsPerDay: [null, [Validators.min(1)]],
//     });
//   }

//   addAssignment(): void {
//     this.assignmentsArray.push(this.createAssignmentGroup());
//   }

//   removeAssignment(index: number): void {
//     if (this.assignmentsArray.length > 1) {
//       this.assignmentsArray.removeAt(index);
//     }
//   }

//   getShifts(assignmentIndex: number): FormArray {
//     return this.assignmentsArray.at(assignmentIndex).get('Shifts') as FormArray;
//   }

//   addShift(assignmentIndex: number): void {
//     const shifts = this.getShifts(assignmentIndex);
//     const dateToAssign = this.dateOptions.length > 0 ? this.dateOptions[shifts.length % this.dateOptions.length] : null;
//     shifts.push(this.createShiftGroup(dateToAssign));
//     this.cdr.detectChanges(); // Ensure the new shift is rendered
//   }

//   removeShift(assignmentIndex: number, shiftIndex: number): void {
//     const shifts = this.getShifts(assignmentIndex);
//     if (shifts.length > 1) {
//       shifts.removeAt(shiftIndex);
//     }
//   }

//   workingDaysValidator(group: FormGroup): { [key: string]: any } | null {
//     const workingDays = group.get('WorkingDays')?.value as number[];
//     return (!workingDays || workingDays.length === 0) ? { noWorkingDays: true } : null;
//   }

//   onWorkingDayChange(dayValue: number, isChecked: boolean, assignmentIndex: number): void {
//     const assignment = this.assignmentsArray.at(assignmentIndex) as FormGroup;
//     let workingDays: number[] = assignment.get('WorkingDays')?.value || [];
//     if (isChecked) {
//       if (!workingDays.includes(dayValue)) workingDays.push(dayValue);
//     } else {
//       workingDays = workingDays.filter(day => day !== dayValue);
//     }
//     assignment.get('WorkingDays')?.setValue(workingDays);
//     assignment.get('WorkingDays')?.updateValueAndValidity();
//   }

//   isWorkingDaySelected(dayValue: number, assignmentIndex: number): boolean {
//     const assignment = this.assignmentsArray.at(assignmentIndex) as FormGroup;
//     const workingDays = assignment.get('WorkingDays')?.value as number[];
//     return workingDays.includes(dayValue);
//   }

//   selectDate(day: { date: Date | null }): void {
//     if (!day.date) return;
//     if (this.isWeeklyMode) {
//       this.selectedStartDate = new Date(day.date);
//       this.selectedStartDate.setHours(0, 0, 0, 0);
//     } else {
//       if (!this.selectedStartDate) {
//         this.selectedStartDate = new Date(day.date);
//         this.selectedStartDate.setHours(0, 0, 0, 0);
//       } else if (!this.selectedEndDate) {
//         const potentialEndDate = new Date(day.date);
//         potentialEndDate.setHours(0, 0, 0, 0);
//         if (potentialEndDate > this.selectedStartDate) this.selectedEndDate = potentialEndDate;
//         else {
//           this.selectedStartDate = potentialEndDate;
//           this.selectedEndDate = null;
//         }
//       } else {
//         this.selectedStartDate = new Date(day.date);
//         this.selectedStartDate.setHours(0, 0, 0, 0);
//         this.selectedEndDate = null;
//       }
//       this.updateDateOptions();
//     }
//     this.cdr.detectChanges();
//   }

//   updateDateOptions(): void {
//     this.dateOptions = [];
//     if (this.selectedStartDate && this.selectedEndDate) {
//       let currentDate = new Date(this.selectedStartDate);
//       while (currentDate <= this.selectedEndDate) {
//         this.dateOptions.push(new Date(currentDate));
//         currentDate.setDate(currentDate.getDate() + 1);
//       }
//     } else if (this.selectedStartDate) {
//       this.dateOptions.push(new Date(this.selectedStartDate));
//     }
//     this.assignmentsArray.controls.forEach((assignment, index) => {
//       const shifts = this.getShifts(index);
//       shifts.controls.forEach((shift, j) => {
//         const dateControl = shift.get('Date');
//         if (dateControl && this.dateOptions.length > 0) {
//           // Only set the date if it's not already set by user selection
//           if (!dateControl.value) {
//             dateControl.setValue(this.dateOptions[j % this.dateOptions.length]);
//           }
//         }
//       });
//     });
//   }

//   private formatDateToString(date: Date | string | null): string {
//     if (!date) return '';
//     if (typeof date === 'string') return date;
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   }

//   private formatTimeToString(time: string): string {
//     return time ? `${time}:00` : '';
//   }

//   private generateShiftDates(startDate: Date, workingDays: number[]): string[] {
//     const dates: string[] = [];
//     const start = new Date(startDate);
//     if (isNaN(start.getTime())) return dates;
//     const endDate = new Date(start);
//     endDate.setDate(start.getDate() + 27); // 28-day period
//     let currentDate = new Date(start);
//     while (currentDate <= endDate) {
//       const dayOfWeek = currentDate.getDay();
//       if (workingDays.includes(dayOfWeek)) dates.push(this.formatDateToString(currentDate));
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return dates;
//   }

//   onSubmit(): void {
//     if (this.scheduleForm.invalid) {
//       this.errorMessage = 'Please fill in all required fields correctly.';
//       return;
//     }
//     if (!this.selectedStartDate) {
//       this.errorMessage = 'Please select a start date.';
//       return;
//     }

//     const formValue = this.scheduleForm.value;
//     const models: IRescheduleAssignmentViewModel[] = formValue.assignments.map((assignment: any, assignmentIndex: number) => {
//       const startDate = this.formatDateToString(this.selectedStartDate!);
//       const endDate = !this.isWeeklyMode && this.selectedEndDate ? this.formatDateToString(this.selectedEndDate) : null;
//       const workingDays = this.isWeeklyMode ? (assignment.WorkingDays.length > 0 ? assignment.WorkingDays : undefined) : undefined;

//       let shifts: IShiftViewModel[] = [];
//       if (this.isWeeklyMode) {
//         const dates = this.generateShiftDates(this.selectedStartDate!, assignment.WorkingDays || []);
//         shifts = dates.flatMap(dateStr => {
//           const date = new Date(dateStr);
//           return this.getShifts(assignmentIndex).controls.map((shift: any) => ({
//             ShiftType: ShiftType.None,
//             ShiftDate: this.formatDateToString(date),
//             StartTime: this.formatTimeToString(shift.get('StartTime').value),
//             EndTime: this.formatTimeToString(shift.get('EndTime').value),
//             MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
//             OperatorId: '1',
//           }));
//         });
//       } else {
//         shifts = this.getShifts(assignmentIndex).controls.map((shift: any) => {
//           const shiftDate = shift.get('Date').value;
//           if (!shiftDate) {
//             console.warn('Shift missing date, using first available date:', this.dateOptions[0]);
//             return {
//               ShiftType: ShiftType.None,
//               ShiftDate: this.formatDateToString(this.dateOptions[0]),
//               StartTime: this.formatTimeToString(shift.get('StartTime').value),
//               EndTime: this.formatTimeToString(shift.get('EndTime').value),
//               MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
//               OperatorId: '1',
//             };
//           }
//           return {
//             ShiftType: ShiftType.None,
//             ShiftDate: this.formatDateToString(shift.get('Date').value),
//             StartTime: this.formatTimeToString(shift.get('StartTime').value),
//             EndTime: this.formatTimeToString(shift.get('EndTime').value),
//             MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
//             OperatorId: '1',
//           };
//         });
//         console.log('Submitting shifts:', shifts); // Debug log
//       }

//       return {
//         ProviderId: this.providerId,
//         CenterId: this.centerId,
//         StartDate: startDate,
//         EndDate: endDate,
//         AssignmentType: this.isWeeklyMode ? AssignmentType.Permanent : AssignmentType.Visiting,
//         WorkingDays: workingDays,
//         Shifts: shifts,
//       };
//     });

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.successMessage = '';
//     models.forEach(model => {
//       this.apiService.rescheduleAssignment(model).subscribe({
//         next: (response: ApiResponse<string>) => {
//           this.isLoading = false;
//           if (response.Status === 200) {
//             this.successMessage = response.Data || 'Assignments rescheduled successfully!';
//             this.scheduleForm.reset();
//             this.assignmentsArray.clear();
//             this.addAssignment();
//             this.selectedStartDate = null;
//             this.selectedEndDate = null;
//             this.dateOptions = [];
//           } else {
//             this.errorMessage = response.Message || 'Failed to reschedule assignments.';
//           }
//           this.cdr.detectChanges();
//         },
//         error: (err) => {
//           this.isLoading = false;
//           this.errorMessage = `An error occurred while rescheduling. Status: ${err.status || 'Unknown'} - ${err.message || 'No additional details'}`;
//           console.error('API error:', err);
//           this.cdr.detectChanges();
//         },
//       });
//     });
//   }

//   toggleMode(): void {
//     this.isWeeklyMode = !this.isWeeklyMode;
//     this.selectedStartDate = null;
//     this.selectedEndDate = null;
//     this.dateOptions = [];
//     this.assignmentsArray.clear();
//     this.assignmentsArray.push(this.createAssignmentGroup());
//     this.updateCalendar();
//     this.cdr.detectChanges();
//   }

//   nextMonth(): void {
//     this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
//     this.updateCalendar();
//   }

//   prevMonth(): void {
//     this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
//     this.updateCalendar();
//   }

//   getMonthName(): string {
//     return this.viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
//   }

//   isToday(date: Date | null): boolean {
//     if (!date) return false;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date.getTime() === today.getTime();
//   }

//   isSelectedStartDate(date: Date | null): boolean {
//     return !!date && !!this.selectedStartDate && date.getTime() === this.selectedStartDate.getTime();
//   }

//   isSelectedEndDate(date: Date | null): boolean {
//     return !!date && !!this.selectedEndDate && date.getTime() === this.selectedEndDate.getTime();
//   }

//   isInRange(date: Date | null): boolean {
//     if (!date || !this.selectedStartDate || !this.selectedEndDate) return false;
//     return date >= this.selectedStartDate && date <= this.selectedEndDate;
//   }

//   goBack(): void {
//     this.router.navigate(['owner/provider-management']);
//   }
// }


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
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
import { IShiftViewModel } from '../../../../types/IShiftViewModel';
import { AssignmentType } from '../../../../Enums/AssignmentType.enum';
import { ShiftType } from '../../../../Enums/ShiftType.enum';
import { switchMap } from 'rxjs/operators';

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
  centerId: number = 3;
  providerId: string = '';
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
    private cdr: ChangeDetectorRef
  ) {
    this.scheduleForm = this.fb.group({
      assignments: this.fb.array([this.createAssignmentGroup()]),
    });
    this.viewDate.setHours(0, 0, 0, 0);
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.providerId = params.get('id') || '';
        console.log('Retrieved providerId:', this.providerId);
        if (!this.providerId) {
          this.errorMessage = 'Provider ID not found.';
        }
        this.updateCalendar();
        return [];
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
      Shifts: this.fb.array([this.createShiftGroup()], { validators: this.uniqueShiftDatesValidator() }),
    }, { validators: this.isWeeklyMode ? this.workingDaysValidator : null });
  }

  createShiftGroup(date: Date | null = null): FormGroup {
    return this.fb.group({
      Date: [date || this.dateOptions[0] || null, this.isWeeklyMode ? [] : [Validators.required]],
      StartTime: ['', [Validators.required, Validators.pattern('^[0-2][0-9]:[0-5][0-9]$')]],
      EndTime: ['', [Validators.required, Validators.pattern('^[0-2][0-9]:[0-5][0-9]$')]],
      MaxPatientsPerDay: [null, [Validators.min(1)]],
    }, { validators: this.timeRangeValidator() });
  }

  // Validator to ensure EndTime is after StartTime
  timeRangeValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const startTime = group.get('StartTime')?.value;
      const endTime = group.get('EndTime')?.value;
      if (startTime && endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        if (end <= start) {
          return { invalidTimeRange: true };
        }
      }
      return null;
    };
  }

  // Validator to ensure unique ShiftDate values in non-weekly mode
  uniqueShiftDatesValidator(): ValidatorFn {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      if (this.isWeeklyMode) return null;
      const shifts = (formArray as FormArray).controls;
      const dates = shifts
        .map(shift => shift.get('Date')?.value)
        .filter(date => date !== null && date !== undefined);
      const uniqueDates = new Set(dates.map(date => this.formatDateToString(date)));
      if (uniqueDates.size < dates.length) {
        return { duplicateShiftDates: true };
      }
      return null;
    };
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
      this.selectedEndDate = null;
    } else {
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
        if (dateControl && this.dateOptions.length > 0 && !dateControl.value) {
          dateControl.setValue(this.dateOptions[j % this.dateOptions.length]);
        }
      });
    });
    this.cdr.detectChanges();
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
    if (!time) return '';
    return time.endsWith(':00') ? time : `${time}:00`;
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
      if (workingDays.includes(dayOfWeek)) {
        dates.push(this.formatDateToString(currentDate));
      }
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
    if (!this.isWeeklyMode && this.dateOptions.length === 0) {
      this.errorMessage = 'Please select valid date(s) for shifts.';
      return;
    }
    if (!this.isWeeklyMode && this.assignmentsArray.controls.some(assignment => {
      const shifts = (assignment.get('Shifts') as FormArray).controls;
      return shifts.length === 0 || shifts.some(shift => !shift.get('Date')?.value);
    })) {
      this.errorMessage = 'All shifts must have a valid date.';
      return;
    }
    if (this.assignmentsArray.controls.some(assignment => {
      const shifts = (assignment.get('Shifts') as FormArray).controls;
      return shifts.some(shift => shift.errors?.['invalidTimeRange']);
    })) {
      this.errorMessage = 'End time must be after start time for all shifts.';
      return;
    }
    if (!this.isWeeklyMode && this.assignmentsArray.controls.some(assignment => {
      return (assignment.get('Shifts') as FormArray).errors?.['duplicateShiftDates'];
    })) {
      this.errorMessage = 'All shifts must have unique dates.';
      return;
    }

    const formValue = this.scheduleForm.value;
    const models: IRescheduleAssignmentViewModel[] = formValue.assignments
      .map((assignment: any, assignmentIndex: number) => {
        const startDate = this.formatDateToString(this.selectedStartDate!);
        const endDate = !this.isWeeklyMode && this.selectedEndDate ? this.formatDateToString(this.selectedEndDate) : startDate;

        let shifts: IShiftViewModel[] = [];
        if (this.isWeeklyMode) {
          const dates = this.generateShiftDates(this.selectedStartDate!, assignment.WorkingDays || []);
          if (dates.length === 0) {
            this.errorMessage = 'Please select at least one working day for weekly mode.';
            return null;
          }
          shifts = dates.flatMap(dateStr => {
            return this.getShifts(assignmentIndex).controls.map((shift: any) => ({
              ShiftType: ShiftType.None,
              ShiftDate: dateStr,
              StartTime: this.formatTimeToString(shift.get('StartTime').value),
              EndTime: this.formatTimeToString(shift.get('EndTime').value),
              MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
              OperatorId: '1',
            }));
          });
        } else {
          shifts = this.getShifts(assignmentIndex).controls.map((shift: any, index: number) => {
            const shiftDate = shift.get('Date').value;
            if (!shiftDate) {
              console.warn(`Shift ${index} missing date, using start date: ${startDate}`);
              return {
                ShiftType: ShiftType.None,
                ShiftDate: startDate,
                StartTime: this.formatTimeToString(shift.get('StartTime').value),
                EndTime: this.formatTimeToString(shift.get('EndTime').value),
                MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
                OperatorId: '1',
              };
            }
            return {
              ShiftType: ShiftType.None,
              ShiftDate: this.formatDateToString(shift.get('Date').value),
              StartTime: this.formatTimeToString(shift.get('StartTime').value),
              EndTime: this.formatTimeToString(shift.get('EndTime').value),
              MaxPatientsPerDay: shift.get('MaxPatientsPerDay').value || null,
              OperatorId: '1',
            };
          });
        }

        return {
          ProviderId: this.providerId,
          CenterId: this.centerId,
          StartDate: startDate,
          EndDate: endDate,
          AssignmentType: this.isWeeklyMode ? AssignmentType.Permanent : AssignmentType.Visiting,
          WorkingDays: this.isWeeklyMode ? (assignment.WorkingDays.length > 0 ? assignment.WorkingDays : undefined) : undefined,
          Shifts: shifts.length > 0 ? shifts : undefined,
        };
      })
      .filter((model: IRescheduleAssignmentViewModel | null): model is IRescheduleAssignmentViewModel => model !== null);

    if (models.length === 0) {
      this.errorMessage = 'No valid assignments to submit.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    models.forEach(model => {
      console.log('Submitting payload:', JSON.stringify(model, null, 2));
      this.apiService.rescheduleAssignment(model).subscribe({
        next: (response: ApiResponse<string>) => {
          this.isLoading = false;
          if (response.Status === 200) {
            this.successMessage = response.Data || 'Assignments and shifts rescheduled successfully!';
            this.scheduleForm.reset();
            this.assignmentsArray.clear();
            this.addAssignment();
            this.selectedStartDate = null;
            this.selectedEndDate = null;
            this.dateOptions = [];
          } else {
            this.errorMessage = response.Message || 'Failed to reschedule assignments and shifts.';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = `Failed to reschedule: ${err.status} - ${err.error?.title || err.message || 'No details'}`;
          console.error('API error details:', JSON.stringify(err.error, null, 2));
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
