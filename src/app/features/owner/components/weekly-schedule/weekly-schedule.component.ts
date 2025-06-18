// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { ApiService } from '../../services/api.service';
// import { ApiResponse } from '../../types/ApiResponse';
// import { IProviderViewModel } from '../../types/IProviderViewModel';
// import { IWeeklyProviderAssignmentViewModel } from '../../types/IWeeklyProviderAssignmentViewModel';
// import { IShiftViewModel } from '../../types/IShiftViewModel';
// import { AssignmentType } from '../../types/Enums/AssignmentType';
// import { ShiftType } from '../../types/Enums/ShiftType';

// @Component({
//   selector: 'app-weekly-schedule',
//   templateUrl: './weekly-schedule.component.html',
//   styleUrls: ['./weekly-schedule.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatCheckboxModule
//   ]
// })
// export class WeeklyScheduleComponent implements OnInit {
//   provider: IProviderViewModel | null = null;
//   errorMessage: string = '';
//   successMessage: string = '';
//   isLoading: boolean = false;
//   scheduleForm: FormGroup;
//   centerId: number = 1;
//   daysOfWeek = [
//     { value: 0, label: 'Sunday' },
//     { value: 1, label: 'Monday' },
//     { value: 2, label: 'Tuesday' },
//     { value: 3, label: 'Wednesday' },
//     { value: 4, label: 'Thursday' },
//     { value: 5, label: 'Friday' },
//     { value: 6, label: 'Saturday' }
//   ];
//   dateOptionsPerAssignment: Date[][] = []; // Store date options for each assignment

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private apiService: ApiService,
//     private fb: FormBuilder
//   ) {
//     this.scheduleForm = this.fb.group({
//       assignments: this.fb.array([this.createAssignmentGroup()])
//     });

//     // Subscribe to changes in StartDate and WorkingDays to update date options
//     this.assignments.controls.forEach((assignment, index) => {
//       this.subscribeToAssignmentChanges(index);
//     });
//   }

//   ngOnInit(): void {
//     const providerId = this.route.snapshot.paramMap.get('id');
//     if (providerId && providerId.trim() !== '') {
//       this.loadProviderDetails(providerId);
//     } else {
//       this.errorMessage = 'Provider ID not found.';
//     }
//   }

//   loadProviderDetails(providerId: string): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.apiService.getProviderById(providerId).subscribe({
//       next: (response: ApiResponse<IProviderViewModel>) => {
//         this.isLoading = false;
//         if (response.Status === 200 && response.Data) {
//           this.provider = response.Data;
//           console.log('Provider details loaded:', this.provider);
//         } else {
//           this.errorMessage = response.Message || 'Failed to load provider details.';
//         }
//       },
//       error: (err) => {
//         this.isLoading = false;
//         if (err.status === 401) {
//           this.errorMessage = 'Unauthorized access. Please log in.';
//           this.router.navigate(['/login']);
//         } else {
//           this.errorMessage = 'An error occurred while loading provider details. (Status: ' + (err.status || 'Unknown') + ')';
//           console.error('API error:', err);
//         }
//       }
//     });
//   }

//   get assignments(): FormArray {
//     return this.scheduleForm.get('assignments') as FormArray;
//   }

//   createAssignmentGroup(): FormGroup {
//     const group = this.fb.group({
//       StartDate: ['', Validators.required],
//       WorkingDays: [[], Validators.required],
//       Shifts: this.fb.array([this.createShiftGroup()])
//     }, { validators: this.workingDaysValidator });

//     return group;
//   }

//   createShiftGroup(): FormGroup {
//     return this.fb.group({
//       Date: [null, Validators.required], // Add Date field for specific day selection
//       StartTime: ['', Validators.required],
//       EndTime: ['', Validators.required],
//       MaxPatientsPerDay: [null, [Validators.min(1)]]
//     });
//   }

//   addAssignment(): void {
//     const index = this.assignments.length;
//     this.assignments.push(this.createAssignmentGroup());
//     this.dateOptionsPerAssignment[index] = [];
//     this.subscribeToAssignmentChanges(index);
//     this.updateDateOptions(index);
//   }

//   removeAssignment(index: number): void {
//     if (this.assignments.length > 1) {
//       this.assignments.removeAt(index);
//       this.dateOptionsPerAssignment.splice(index, 1);
//     }
//   }

//   getShifts(assignmentIndex: number): FormArray {
//     return this.assignments.at(assignmentIndex).get('Shifts') as FormArray;
//   }

//   addShift(assignmentIndex: number): void {
//     const shifts = this.getShifts(assignmentIndex);
//     const newShift = this.createShiftGroup();
//     // Set the Date to the first available option if possible
//     if (this.dateOptionsPerAssignment[assignmentIndex]?.length > 0) {
//       newShift.get('Date')?.setValue(this.dateOptionsPerAssignment[assignmentIndex][0]);
//     }
//     shifts.push(newShift);
//   }

//   removeShift(assignmentIndex: number, shiftIndex: number): void {
//     const shifts = this.getShifts(assignmentIndex);
//     if (shifts.length > 1) {
//       shifts.removeAt(shiftIndex);
//     }
//   }

//   workingDaysValidator(group: FormGroup): { [key: string]: any } | null {
//     const workingDays = group.get('WorkingDays')?.value as number[];
//     if (!workingDays || workingDays.length === 0) {
//       return { noWorkingDays: true };
//     }
//     return null;
//   }

//   onWorkingDayChange(dayValue: number, isChecked: boolean, assignmentIndex: number): void {
//     const assignment = this.assignments.at(assignmentIndex) as FormGroup;
//     const workingDaysControl = assignment.get('WorkingDays');
//     let workingDays: number[] = workingDaysControl?.value || [];

//     if (isChecked) {
//       if (!workingDays.includes(dayValue)) {
//         workingDays.push(dayValue);
//       }
//     } else {
//       workingDays = workingDays.filter(day => day !== dayValue);
//     }

//     workingDaysControl?.setValue(workingDays);
//     workingDaysControl?.updateValueAndValidity();
//     this.updateDateOptions(assignmentIndex); // Update dates when working days change
//   }

//   isWorkingDaySelected(dayValue: number, assignmentIndex: number): boolean {
//     const assignment = this.assignments.at(assignmentIndex) as FormGroup;
//     const workingDays = assignment.get('WorkingDays')?.value as number[];
//     return workingDays.includes(dayValue);
//   }

//   subscribeToAssignmentChanges(assignmentIndex: number): void {
//     const assignment = this.assignments.at(assignmentIndex) as FormGroup;
//     assignment.get('StartDate')?.valueChanges.subscribe(() => this.updateDateOptions(assignmentIndex));
//     assignment.get('WorkingDays')?.valueChanges.subscribe(() => this.updateDateOptions(assignmentIndex));
//   }

//   updateDateOptions(assignmentIndex: number): void {
//     const assignment = this.assignments.at(assignmentIndex) as FormGroup;
//     const startDateValue = assignment.get('StartDate')?.value;
//     const workingDays = assignment.get('WorkingDays')?.value as number[] || [];
//     this.dateOptionsPerAssignment[assignmentIndex] = [];

//     if (!startDateValue || workingDays.length === 0) return;

//     // Convert startDate to a Date object (it might be a string from <input type="date">)
//     const startDate = new Date(startDateValue);
//     if (isNaN(startDate.getTime())) return;

//     // Generate dates for the next 28 days (as per backend logic)
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 27); // 28-day period

//     let currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       const dayOfWeek = currentDate.getDay();
//       if (workingDays.includes(dayOfWeek)) {
//         this.dateOptionsPerAssignment[assignmentIndex].push(new Date(currentDate));
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }

//     // Update shifts with new date options
//     const shifts = this.getShifts(assignmentIndex);
//     shifts.controls.forEach((control) => {
//       const dateControl = control.get('Date');
//       if (dateControl && this.dateOptionsPerAssignment[assignmentIndex].length > 0) {
//         dateControl.setValue(this.dateOptionsPerAssignment[assignmentIndex][0]);
//         dateControl.updateValueAndValidity();
//       }
//     });
//   }

//   private formatDateToString(date: Date | string | null): string {
//     if (!date) return '';
//     if (typeof date === 'string') {
//       return date;
//     }
//     return date.toISOString().split('T')[0];
//   }

//   private formatTimeToString(time: string): string {
//     return time ? `${time}:00` : '';
//   }

//   async onSubmit(): Promise<void> {
//     if (this.scheduleForm.invalid) {
//       this.errorMessage = 'Please fill in all required fields correctly.';
//       return;
//     }

//     if (!this.provider) {
//       this.errorMessage = 'Provider details not loaded.';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     const formValue = this.scheduleForm.value;
//     const assignments = formValue.assignments;

//     for (let i = 0; i < assignments.length; i++) {
//       const assignment = assignments[i];
//       const startDate = this.formatDateToString(assignment.StartDate);

//       const model: IWeeklyProviderAssignmentViewModel = {
//         ProviderId: this.provider.ProviderId,
//         CenterId: this.centerId,
//         StartDate: startDate,
//         AssignmentType: AssignmentType.Permanent,
//         WorkingDays: assignment.WorkingDays || [],
//         Shifts: assignment.Shifts.map((shift: any): IShiftViewModel => ({
//           ShiftType: ShiftType.None,
//           ShiftDate: this.formatDateToString(shift.Date),
//           StartTime: this.formatTimeToString(shift.StartTime),
//           EndTime: this.formatTimeToString(shift.EndTime),
//           MaxPatientsPerDay: shift.MaxPatientsPerDay || null,
//           OperatorId: 'user1-operator'
//         }))
//       };

//       console.log(`Sending payload for Assignment ${i + 1}:`, JSON.stringify(model, null, 2));

//       try {
//         const response = await this.apiService.assignProviderToCenterWithWorkingDays(model).toPromise();
//         if (!response) {
//           this.errorMessage = `Failed to assign schedule for Assignment ${i + 1}: No response from server.`;
//           this.isLoading = false;
//           return;
//         }
//         if (response.Status !== 200) {
//           this.errorMessage = `Failed to assign schedule for Assignment ${i + 1}: ${response.Message || 'Unknown error'}`;
//           this.isLoading = false;
//           return;
//         }
//       } catch (err: any) {
//         this.isLoading = false;
//         this.errorMessage = `An error occurred while assigning Assignment ${i + 1}. Status: ${err.status || 'Unknown'} - ${err.message || 'No additional details'}`;
//         console.error(`API error for Assignment ${i + 1}:`, err);
//         return;
//       }
//     }

//     this.isLoading = false;
//     this.successMessage = 'All weekly schedules assigned successfully!';
//     this.scheduleForm.reset();
//     this.assignments.clear();
//     this.dateOptionsPerAssignment = [];
//     this.addAssignment();
//   }

//   ManuallySchedule(): void {
//     this.router.navigate(['/manually-schedule', this.route.snapshot.paramMap.get('id')]);
//   }

//   WeeklySchedule(): void {
//     this.router.navigate(['/weekly-schedule', this.route.snapshot.paramMap.get('id')]);
//   }

//   goBack(): void {
//     this.router.navigate(['/provider-management']);
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { ApiService } from '../../services/api.service';
// import { ApiResponse } from '../../types/ApiResponse';
// import { IProviderViewModel } from '../../types/IProviderViewModel';
// import { IWeeklyProviderAssignmentViewModel } from '../../types/IWeeklyProviderAssignmentViewModel';
// import { IShiftViewModel } from '../../types/IShiftViewModel';
// import { AssignmentType } from '../../types/Enums/AssignmentType';
// import { ShiftType } from '../../types/Enums/ShiftType';

// @Component({
//   selector: 'app-weekly-schedule',
//   templateUrl: './weekly-schedule.component.html',
//   styleUrls: ['./weekly-schedule.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatCheckboxModule
//   ]
// })
// export class WeeklyScheduleComponent implements OnInit {
//   provider: IProviderViewModel | null = null;
//   errorMessage: string = '';
//   successMessage: string = '';
//   isLoading: boolean = false;
//   scheduleForm: FormGroup;
//   centerId: number = 1;
//   daysOfWeek = [
//     { value: 0, label: 'Sunday' },
//     { value: 1, label: 'Monday' },
//     { value: 2, label: 'Tuesday' },
//     { value: 3, label: 'Wednesday' },
//     { value: 4, label: 'Thursday' },
//     { value: 5, label: 'Friday' },
//     { value: 6, label: 'Saturday' }
//   ];

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private apiService: ApiService,
//     private fb: FormBuilder
//   ) {
//     this.scheduleForm = this.fb.group({
//       assignments: this.fb.array([this.createAssignmentGroup()])
//     });
//   }

//   ngOnInit(): void {
//     const providerId = this.route.snapshot.paramMap.get('id');
//     if (providerId && providerId.trim() !== '') {
//       this.loadProviderDetails(providerId);
//     } else {
//       this.errorMessage = 'Provider ID not found.';
//     }
//   }

//   loadProviderDetails(providerId: string): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.apiService.getProviderById(providerId).subscribe({
//       next: (response: ApiResponse<IProviderViewModel>) => {
//         this.isLoading = false;
//         if (response.Status === 200 && response.Data) {
//           this.provider = response.Data;
//           console.log('Provider details loaded:', this.provider);
//         } else {
//           this.errorMessage = response.Message || 'Failed to load provider details.';
//         }
//       },
//       error: (err) => {
//         this.isLoading = false;
//         if (err.status === 401) {
//           this.errorMessage = 'Unauthorized access. Please log in.';
//           this.router.navigate(['/login']);
//         } else {
//           this.errorMessage = 'An error occurred while loading provider details. (Status: ' + (err.status || 'Unknown') + ')';
//           console.error('API error:', err);
//         }
//       }
//     });
//   }

//   get assignments(): FormArray {
//     return this.scheduleForm.get('assignments') as FormArray;
//   }

//   createAssignmentGroup(): FormGroup {
//     return this.fb.group({
//       StartDate: ['', Validators.required],
//       WorkingDays: [[], Validators.required],
//       Shifts: this.fb.array([this.createShiftGroup()])
//     }, { validators: this.workingDaysValidator });
//   }

//   createShiftGroup(): FormGroup {
//     return this.fb.group({
//       StartTime: ['', Validators.required],
//       EndTime: ['', Validators.required],
//       MaxPatientsPerDay: [null, [Validators.min(1)]]
//     });
//   }

//   addAssignment(): void {
//     this.assignments.push(this.createAssignmentGroup());
//   }

//   removeAssignment(index: number): void {
//     if (this.assignments.length > 1) {
//       this.assignments.removeAt(index);
//     }
//   }

//   getShifts(assignmentIndex: number): FormArray {
//     return this.assignments.at(assignmentIndex).get('Shifts') as FormArray;
//   }

//   addShift(assignmentIndex: number): void {
//     const shifts = this.getShifts(assignmentIndex);
//     shifts.push(this.createShiftGroup());
//   }

//   removeShift(assignmentIndex: number, shiftIndex: number): void {
//     const shifts = this.getShifts(assignmentIndex);
//     if (shifts.length > 1) {
//       shifts.removeAt(shiftIndex);
//     }
//   }

//   workingDaysValidator(group: FormGroup): { [key: string]: any } | null {
//     const workingDays = group.get('WorkingDays')?.value as number[];
//     if (!workingDays || workingDays.length === 0) {
//       return { noWorkingDays: true };
//     }
//     return null;
//   }

//   onWorkingDayChange(dayValue: number, isChecked: boolean, assignmentIndex: number): void {
//     const assignment = this.assignments.at(assignmentIndex) as FormGroup;
//     const workingDaysControl = assignment.get('WorkingDays');
//     let workingDays: number[] = workingDaysControl?.value || [];

//     if (isChecked) {
//       if (!workingDays.includes(dayValue)) {
//         workingDays.push(dayValue);
//       }
//     } else {
//       workingDays = workingDays.filter(day => day !== dayValue);
//     }

//     workingDaysControl?.setValue(workingDays);
//     workingDaysControl?.updateValueAndValidity();
//   }

//   isWorkingDaySelected(dayValue: number, assignmentIndex: number): boolean {
//     const assignment = this.assignments.at(assignmentIndex) as FormGroup;
//     const workingDays = assignment.get('WorkingDays')?.value as number[];
//     return workingDays.includes(dayValue);
//   }

//   private formatDateToString(date: Date | string | null): string {
//     if (!date) return '';
//     if (typeof date === 'string') {
//       return date; // Handle string from <input type="date"> (e.g., "2025-06-01")
//     }
//     return date.toISOString().split('T')[0]; // Handle Date object
//   }

//   private formatTimeToString(time: string): string {
//     return time ? `${time}:00` : '';
//   }

//   // Generate dates for a 28-day period based on StartDate and WorkingDays
//   private generateShiftDates(startDate: string | Date, workingDays: number[]): string[] {
//     const dates: string[] = [];
//     const start = new Date(startDate);
//     if (isNaN(start.getTime())) return dates;

//     const endDate = new Date(start);
//     endDate.setDate(start.getDate() + 27); // 28-day period

//     let currentDate = new Date(start);
//     while (currentDate <= endDate) {
//       const dayOfWeek = currentDate.getDay();
//       if (workingDays.includes(dayOfWeek)) {
//         dates.push(this.formatDateToString(currentDate));
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
//     return dates;
//   }

//   async onSubmit(): Promise<void> {
//     if (this.scheduleForm.invalid) {
//       this.errorMessage = 'Please fill in all required fields correctly.';
//       return;
//     }

//     if (!this.provider) {
//       this.errorMessage = 'Provider details not loaded.';
//       return;
//     }

//     this.isLoading = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     const formValue = this.scheduleForm.value;
//     const assignments = formValue.assignments;

//     for (let i = 0; i < assignments.length; i++) {
//       const assignment = assignments[i];
//       const startDate = this.formatDateToString(assignment.StartDate);
//       const workingDays = assignment.WorkingDays || [];

//       // Generate all possible shift dates based on StartDate and WorkingDays for 28 days
//       const shiftDates = this.generateShiftDates(startDate, workingDays);
//       if (shiftDates.length === 0) {
//         this.errorMessage = `No valid dates generated for Assignment ${i + 1}. Please check StartDate and WorkingDays.`;
//         this.isLoading = false;
//         return;
//       }

//       // Distribute shifts across the generated dates
//       const shifts: IShiftViewModel[] = [];
//       const formShifts = assignment.Shifts || [];
//       for (let j = 0; j < formShifts.length; j++) {
//         const shift = formShifts[j];
//         // Assign each shift to a unique date, cycling if necessary
//         for (let k = 0; k < shiftDates.length; k++) {
//           shifts.push({
//             ShiftType: ShiftType.None,
//             ShiftDate: shiftDates[k],
//             StartTime: this.formatTimeToString(shift.StartTime) || '',
//             EndTime: this.formatTimeToString(shift.EndTime) || '',
//             MaxPatientsPerDay: shift.MaxPatientsPerDay || null,
//             OperatorId: 'user1-operator'
//           });
//         }
//       }

//       const model: IWeeklyProviderAssignmentViewModel = {
//         ProviderId: this.provider.ProviderId,
//         CenterId: this.centerId,
//         StartDate: startDate,
//         AssignmentType: AssignmentType.Permanent,
//         WorkingDays: workingDays,
//         Shifts: shifts
//       };

//       console.log(`Sending payload for Assignment ${i + 1}:`, JSON.stringify(model, null, 2));

//       try {
//         const response = await this.apiService.assignProviderToCenterWithWorkingDays(model).toPromise();
//         if (!response) {
//           this.errorMessage = `Failed to assign schedule for Assignment ${i + 1}: No response from server.`;
//           this.isLoading = false;
//           return;
//         }
//         if (response.Status !== 200) {
//           this.errorMessage = `Failed to assign schedule for Assignment ${i + 1}: ${response.Message || 'Unknown error'}`;
//           this.isLoading = false;
//           return;
//         }
//       } catch (err: any) {
//         this.isLoading = false;
//         this.errorMessage = `An error occurred while assigning Assignment ${i + 1}. Status: ${err.status || 'Unknown'} - ${err.message || 'No additional details'}`;
//         console.error(`API error for Assignment ${i + 1}:`, err);
//         return;
//       }
//     }

//     this.isLoading = false;
//     this.successMessage = 'All weekly schedules assigned successfully!';
//     this.scheduleForm.reset();
//     this.assignments.clear();
//     this.addAssignment();
//   }

//   ManuallySchedule(): void {
//     this.router.navigate(['/manually-schedule', this.route.snapshot.paramMap.get('id')]);
//   }

//   WeeklySchedule(): void {
//     this.router.navigate(['/weekly-schedule', this.route.snapshot.paramMap.get('id')]);
//   }

//   goBack(): void {
//     this.router.navigate(['/provider-management']);
//   }
// }

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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../../../services/api.service';
import { ApiResponse } from '../../../../types/ApiResponse';
import { IProviderViewModel } from '../../../../types/IProviderViewModel';
import { IWeeklyProviderAssignmentViewModel } from '../../../../types/IWeeklyProviderAssignmentViewModel';
import { IShiftViewModel } from '../../../../types/IShiftViewModel';
import { AssignmentType } from '../../../../Enums/AssignmentType.enum';
import { ShiftType } from '../../../../Enums/ShiftType.enum';
@Component({
  selector: 'app-weekly-schedule',
  templateUrl: './weekly-schedule.component.html',
  styleUrls: ['./weekly-schedule.component.css'],
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
    MatCheckboxModule,
  ],
})
export class WeeklyScheduleComponent implements OnInit {
  provider: IProviderViewModel | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  scheduleForm: FormGroup;
  centerId: number = 1;
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
  calendarAssignments: { startDate: Date; endDate: Date }[] = []; // Renamed to avoid conflict
  daysInMonth: { date: Date | null; hasAssignment: boolean }[] = [];
  selectedStartDate: Date | null = null;

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
    const providerId = this.route.snapshot.paramMap.get('id');
    if (providerId && providerId.trim() !== '') {
      this.loadProviderDetails(providerId);
      this.loadAssignments(providerId);
    } else {
      this.errorMessage = 'Provider ID not found.';
      this.updateCalendar();
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
          console.log('Provider details loaded:', this.provider);
        } else {
          this.errorMessage =
            response.Message || 'Failed to load provider details.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in.';
          this.router.navigate(['/login']);
        } else {
          this.errorMessage =
            'An error occurred while loading provider details. (Status: ' +
            (err.status || 'Unknown') +
            ')';
          console.error('API error:', err);
        }
      },
    });
  }

  loadAssignments(providerId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService
      .getProviderAssignments(providerId, this.centerId)
      .subscribe({
        next: (response: ApiResponse<any[]>) => {
          this.isLoading = false;
          console.log('API response for assignments:', response);
          if (
            response.Status === 200 &&
            response.Data &&
            response.Data.length > 0
          ) {
            this.calendarAssignments = response.Data.map((item) => {
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
            console.log(
              'Assignments array after mapping:',
              this.calendarAssignments
            );
          } else {
            this.calendarAssignments = [];
            console.log(
              'No assignments found, assignments set to:',
              this.calendarAssignments
            );
          }
          this.updateCalendar();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status !== 404) {
            this.errorMessage = 'An error occurred while loading assignments.';
            console.error('Assignment load error:', err);
          } else {
            this.calendarAssignments = [];
            console.log(
              'No assignments found (404), assignments set to:',
              this.calendarAssignments
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
      const hasAssignment = this.calendarAssignments.some((assignment) => {
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

  get assignments(): FormArray {
    return this.scheduleForm.get('assignments') as FormArray;
  }

  createAssignmentGroup(): FormGroup {
    return this.fb.group(
      {
        StartDate: ['', Validators.required],
        WorkingDays: [[], Validators.required],
        Shifts: this.fb.array([this.createShiftGroup()]),
      },
      { validators: this.workingDaysValidator }
    );
  }

  createShiftGroup(): FormGroup {
    return this.fb.group({
      StartTime: ['', Validators.required],
      EndTime: ['', Validators.required],
      MaxPatientsPerDay: [null, [Validators.min(1)]],
    });
  }

  addAssignment(): void {
    this.assignments.push(this.createAssignmentGroup());
  }

  removeAssignment(index: number): void {
    if (this.assignments.length > 1) {
      this.assignments.removeAt(index);
    }
  }

  getShifts(assignmentIndex: number): FormArray {
    return this.assignments.at(assignmentIndex).get('Shifts') as FormArray;
  }

  addShift(assignmentIndex: number): void {
    const shifts = this.getShifts(assignmentIndex);
    shifts.push(this.createShiftGroup());
  }

  removeShift(assignmentIndex: number, shiftIndex: number): void {
    const shifts = this.getShifts(assignmentIndex);
    if (shifts.length > 1) {
      shifts.removeAt(shiftIndex);
    }
  }

  workingDaysValidator(group: FormGroup): { [key: string]: any } | null {
    const workingDays = group.get('WorkingDays')?.value as number[];
    if (!workingDays || workingDays.length === 0) {
      return { noWorkingDays: true };
    }
    return null;
  }

  onWorkingDayChange(
    dayValue: number,
    isChecked: boolean,
    assignmentIndex: number
  ): void {
    const assignment = this.assignments.at(assignmentIndex) as FormGroup;
    const workingDaysControl = assignment.get('WorkingDays');
    let workingDays: number[] = workingDaysControl?.value || [];

    if (isChecked) {
      if (!workingDays.includes(dayValue)) {
        workingDays.push(dayValue);
      }
    } else {
      workingDays = workingDays.filter((day) => day !== dayValue);
    }

    workingDaysControl?.setValue(workingDays);
    workingDaysControl?.updateValueAndValidity();
  }

  isWorkingDaySelected(dayValue: number, assignmentIndex: number): boolean {
    const assignment = this.assignments.at(assignmentIndex) as FormGroup;
    const workingDays = assignment.get('WorkingDays')?.value as number[];
    return workingDays.includes(dayValue);
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

  private generateShiftDates(
    startDate: string | Date,
    workingDays: number[]
  ): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    if (isNaN(start.getTime())) return dates;

    const endDate = new Date(start);
    endDate.setDate(start.getDate() + 27); // 28-day period

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

  async onSubmit(): Promise<void> {
    if (this.scheduleForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.provider) {
      this.errorMessage = 'Provider details not loaded.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.scheduleForm.value;
    const assignments = formValue.assignments;

    for (let i = 0; i < assignments.length; i++) {
      const assignment = assignments[i];
      const startDate = this.formatDateToString(assignment.StartDate);
      const workingDays = assignment.WorkingDays || [];

      if (!startDate) {
        this.errorMessage = `No StartDate selected for Assignment ${i + 1}.`;
        this.isLoading = false;
        return;
      }

      const shiftDates = this.generateShiftDates(startDate, workingDays);
      if (shiftDates.length === 0) {
        this.errorMessage = `No valid dates generated for Assignment ${
          i + 1
        }. Please check StartDate and WorkingDays.`;
        this.isLoading = false;
        return;
      }

      const shifts: IShiftViewModel[] = [];
      const formShifts = assignment.Shifts || [];
      for (let j = 0; j < formShifts.length; j++) {
        const shift = formShifts[j];
        for (let k = 0; k < shiftDates.length; k++) {
          shifts.push({
            ShiftType: ShiftType.None,
            ShiftDate: shiftDates[k],
            StartTime: this.formatTimeToString(shift.StartTime) || '',
            EndTime: this.formatTimeToString(shift.EndTime) || '',
            MaxPatientsPerDay: shift.MaxPatientsPerDay || null,
            OperatorId: 'user1-operator',
          });
        }
      }

      const model: IWeeklyProviderAssignmentViewModel = {
        ProviderId: this.provider.ProviderId,
        CenterId: this.centerId,
        StartDate: startDate,
        AssignmentType: AssignmentType.Permanent,
        WorkingDays: workingDays,
        Shifts: shifts,
      };

      console.log(
        `Sending payload for Assignment ${i + 1}:`,
        JSON.stringify(model, null, 2)
      );

      try {
        const response = await this.apiService
          .assignProviderToCenterWithWorkingDays(model)
          .toPromise();
        if (!response) {
          this.errorMessage = `Failed to assign schedule for Assignment ${
            i + 1
          }: No response from server.`;
          this.isLoading = false;
          return;
        }
        if (response.Status !== 200) {
          this.errorMessage = `Failed to assign schedule for Assignment ${
            i + 1
          }: ${response.Message || 'Unknown error'}`;
          this.isLoading = false;
          return;
        }
      } catch (err: any) {
        this.isLoading = false;
        this.errorMessage = `An error occurred while assigning Assignment ${
          i + 1
        }. Status: ${err.status || 'Unknown'} - ${
          err.message || 'No additional details'
        }`;
        console.error(`API error for Assignment ${i + 1}:`, err);
        return;
      }
    }

    this.isLoading = false;
    this.successMessage = 'All weekly schedules assigned successfully!';
    this.scheduleForm.reset();
    this.assignments.clear();
    this.addAssignment();
  }

  selectDate(day: { date: Date | null; hasAssignment: boolean }): void {
    if (!day.date || day.hasAssignment) return;

    // For weekly schedule, only set the StartDate; no EndDate selection
    this.selectedStartDate = new Date(day.date);
    this.selectedStartDate.setHours(0, 0, 0, 0);

    // Update the StartDate in the first assignment form group
    if (this.assignments.length > 0) {
      const firstAssignment = this.assignments.at(0) as FormGroup;
      firstAssignment
        .get('StartDate')
        ?.setValue(this.formatDateToString(this.selectedStartDate));
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

  updateDateOptions(): void {
    // No need to update dateOptions for weekly schedule since it's a single StartDate
    // The form will use the selectedStartDate directly
  }

  ManuallySchedule(): void {
    this.router.navigate([
      '/manually-schedule',
      this.route.snapshot.paramMap.get('id'),
    ]);
  }

  WeeklySchedule(): void {
    this.router.navigate([
      '/weekly-schedule',
      this.route.snapshot.paramMap.get('id'),
    ]);
  }

  goBack(): void {
    this.router.navigate(['/provider-management']);
  }
}
