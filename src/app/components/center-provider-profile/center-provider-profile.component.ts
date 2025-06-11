import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { IProviderViewModel } from '../../types/IProviderViewModel';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../types/ApiResponse';

@Component({
  selector: 'app-center-provider-profile',
  templateUrl: './center-provider-profile.component.html',
  styleUrls: ['./center-provider-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule]
})
export class CenterProviderProfileComponent implements OnInit {
  provider: IProviderViewModel | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  viewDate: Date = new Date();
  centerId: number = 1;
  assignments: { startDate: Date; endDate: Date }[] = [];
  daysInMonth: { date: Date | null; hasAssignment: boolean }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const providerId = this.route.snapshot.paramMap.get('id');
    console.log('Provider ID from route:', providerId);
    if (providerId && providerId.trim() !== '') {
      this.loadProviderDetails(providerId);
      this.loadAssignments(providerId);
    } else {
      this.errorMessage = 'Provider ID not found.';
      this.updateCalendar(); // Populate calendar even if providerId is invalid
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
          this.errorMessage = response.Message || 'Failed to load provider details.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading provider details.';
        console.error('API error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  loadAssignments(providerId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.apiService.getProviderAssignments(providerId, this.centerId).subscribe({
      next: (response: ApiResponse<any[]>) => {
        this.isLoading = false;
        console.log('API response for assignments:', response);
        if (response.Status === 200 && response.Data) {
          this.assignments = response.Data.map(item => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            // Reset time to midnight to avoid time component issues
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            console.log('Parsed assignment range:', { startDate, endDate });
            return { startDate, endDate };
          }).filter(range => !isNaN(range.startDate.getTime()) && !isNaN(range.endDate.getTime())); // Filter out invalid dates
          console.log('Assignments array after mapping:', this.assignments);
        } else {
          this.errorMessage = response.Message || 'No assignments found.';
          this.assignments = [];
          console.log('No assignments found, assignments set to:', this.assignments);
        }
        this.updateCalendar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading assignments.';
        this.assignments = [];
        console.log('Assignment load error:', err);
        this.updateCalendar();
        this.cdr.detectChanges();
      }
    });
  }

  private updateCalendar(): void {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDay = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    console.log('Starting day:', startingDay, 'Days in month:', daysInMonth);

    // Add padding days (set to null to avoid rendering)
    for (let i = 0; i < startingDay; i++) {
      this.daysInMonth.push({ date: null, hasAssignment: false });
      console.log('Added padding day at index:', i);
    }

    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0); // Reset time to midnight for consistent comparison
      // Check if the current date falls within any assignment range
      const hasAssignment = this.assignments.some(assignment => {
        const start = new Date(assignment.startDate);
        const end = new Date(assignment.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        console.log(`Checking day ${currentDate.toISOString().split('T')[0]} against ${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`);
        return currentDate >= start && currentDate <= end;
      });
      this.daysInMonth.push({ date: currentDate, hasAssignment });
      console.log(`Added day ${day}, hasAssignment: ${hasAssignment}`);
    }

    console.log('Final daysInMonth array:', this.daysInMonth);
  }

  goBack(): void {
    this.router.navigate(['/provider-management']);
  }

  nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.loadAssignments(this.route.snapshot.paramMap.get('id') || '');
  }

  prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.loadAssignments(this.route.snapshot.paramMap.get('id') || '');
  }

  getMonthName(): string {
    return this.viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for consistent comparison
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }
}
