import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';
import { IPaginationViewModel } from '../../../../types/IPaginationViewModel';
import { IProviderViewModel } from '../../../../types/IProviderViewModel';
import { ApiResponse } from '../../../../types/ApiResponse';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-provider-schedule',
  templateUrl: './provider-management.component.html',
  styleUrls: ['./provider-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule
  ]
})
export class ProviderManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'phoneNumber', 'specialization', 'status'];
  dataSource: MatTableDataSource<IProviderViewModel> = new MatTableDataSource<IProviderViewModel>([]);

  providers: IProviderViewModel[] = [];
  specializations: string[] = ['Cardiology', 'Pediatrics', 'Orthopedics', 'Internal Medicine'];

  totalItems: number = 0;
  pageSize: number = 9;
  pageIndex: number = 0;
  sortBy: string = 'AddDate';
  sortFilter: string = '';
  dateFilter: string = '';
  statusFilter: string = '';
  specializationFilter: string = '';

  errorMessage: string = '';
  isLoading: boolean = false;
  centerId: number = 0;
  showDeletePopup: boolean = false;
  selectedProviderId: string | null = null;

  private statusMap: { [key: string]: number } = {
    Online: 0,
    Offline: 1,
  };

  @ViewChild('deletePopup') deletePopup!: ElementRef;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.centerId = this.authService.getCenterId();
    console.log(this.centerId);
    this.loadAllProviders();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  loadAllProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.dataSource.data = [];
    this.providers = [];

    this.fetchAllPages(1);
  }

  fetchAllPages(page: number): void {
    this.apiService.getProviders(this.centerId, page, this.pageSize, this.sortBy, this.specializationFilter).subscribe({
      next: (response: ApiResponse<IPaginationViewModel<IProviderViewModel>>) => {
        if (response.Status === 200 && response.Data?.Data) {
          const newProviders = (response.Data.Data as unknown as IProviderViewModel[]).map((provider: IProviderViewModel) => ({
            AssignmentId: provider.AssignmentId,
            ProviderId: provider.ProviderId || 'unknown',
            FirstName: provider.FirstName || 'Unknown',
            LastName: provider.LastName || '',
            Specialization: provider.Specialization || 'N/A',
            Bio: provider.Bio || '',
            ExperienceYears: provider.ExperienceYears ?? 0,
            LicenseNumber: provider.LicenseNumber || '',
            Gender: provider.Gender || 0,
            Street: provider.Street || '',
            City: provider.City || '',
            Governorate: provider.Governorate || '',
            Country: provider.Country || '',
            BirthDate: provider.BirthDate || '',
            Image: provider.Image || '',
            Availability: provider.Availability || '',
            EstimatedDuration: provider.EstimatedDuration || 0,
            AddDate: provider.AddDate ? this.formatDate(provider.AddDate) : 'N/A',
            Email: provider.Email || 'N/A',
            PhoneNumber: provider.PhoneNumber || 'N/A',
            Status: provider.Status ?? 0
          }));
          this.providers.push(...newProviders);
          console.log(this.providers);
          
          const totalPages = Math.ceil((response.Data.Total || 0) / this.pageSize);
          if (page < totalPages) {
            this.fetchAllPages(page + 1);
          } else {
            this.deduplicateAndPaginate();
          }
        } else {
          this.handleError(response.Message || 'Failed to load providers.');
        }
      },
      error: (err) => {
        this.handleError('An error occurred while loading providers. Please try again later. (Status: ' + (err.status || 'Unknown') + ')');
      }
    });
  }

  deduplicateAndPaginate(): void {
    this.isLoading = false;
    const providerMap = new Map<string, IProviderViewModel>();
    this.providers.forEach((provider) => {
      const providerId = provider.ProviderId || `temp-${Math.random()}`; // Use a temporary ID for mapping
      if (!providerMap.has(providerId) && provider.ProviderId && provider.ProviderId !== 'unknown') { // Only map if ProviderId is valid
        providerMap.set(providerId, provider);
      }
    });

    this.providers = Array.from(providerMap.values()).filter(p => p.ProviderId && p.ProviderId !== 'unknown'); // Filter out 'unknown' ProviderId
    this.totalItems = this.providers.length;
    this.applyFilters();
  }

  applyFilters(): void {
    let filteredProviders = [...this.providers];

    // Sorting by Name
    if (this.sortFilter === 'Name') {
      filteredProviders.sort((a, b) => {
        const nameA = ((a.FirstName || '') + ' ' + (a.LastName || '')).trim().toLowerCase();
        const nameB = ((b.FirstName || '') + ' ' + (b.LastName || '')).trim().toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    if (this.dateFilter) {
      filteredProviders = filteredProviders.filter(provider => {
        const year = new Date(provider.AddDate).getFullYear().toString();
        return year === this.dateFilter || (this.dateFilter === '' && !year);
      });
    }

    if (this.statusFilter) {
      const statusValue = this.statusMap[this.statusFilter];
      if (statusValue !== undefined) {
        filteredProviders = filteredProviders.filter(provider => provider.Status === statusValue);
      }
    }

    if (this.specializationFilter) {
      filteredProviders = filteredProviders.filter(provider => provider.Specialization === this.specializationFilter || (this.specializationFilter === '' && !provider.Specialization));
    }

    this.totalItems = filteredProviders.length;
    const startIndex = this.pageIndex * this.pageSize;
    this.dataSource.data = filteredProviders.slice(startIndex, startIndex + this.pageSize);
    this.cdr.detectChanges();
  }

  handleError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
    this.dataSource.data = [];
    this.cdr.detectChanges();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  onSortChange(sort: Sort): void {
    this.sortBy = sort.active === 'phoneNumber' ? 'AddDate' : sort.active;
    this.pageIndex = 0;
    this.loadAllProviders();
  }

  onSortFilterChange(event: string): void {
    this.sortFilter = event;
    this.pageIndex = 0;
    this.applyFilters();
  }

  onDateFilterChange(event: string): void {
    this.dateFilter = event;
    this.pageIndex = 0;
    this.applyFilters();
  }

  onStatusFilterChange(event: string): void {
    this.statusFilter = event;
    this.pageIndex = 0;
    this.applyFilters();
  }

  onSpecializationFilterChange(event: string): void {
    this.specializationFilter = event;
    this.pageIndex = 0;
    this.applyFilters();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    const maxPageIndex = Math.ceil(this.totalItems / this.pageSize) - 1;
    if (this.pageIndex < maxPageIndex) {
      this.pageIndex++;
      this.applyFilters();
    }
  }

  resetFilters(): void {
    this.sortFilter = '';
    this.dateFilter = '';
    this.statusFilter = '';
    this.specializationFilter = '';
    this.pageIndex = 0;
    this.loadAllProviders();
  }

  getDisplayRange(): string {
    const start = (this.pageIndex * this.pageSize) + 1;
    const end = Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
    return `${start}-${end}`;
  }

  viewProfile(providerId: string): void {
    this.router.navigate(['owner/center-provider-profile', providerId]);
  }

  reschedule(providerId: string): void {
    this.router.navigate(['owner/reschedule-assignment', providerId]);
  }

  deleteProvider(providerId: string): void {
    if (!providerId || providerId.trim() === '' || providerId === 'unknown') {
      this.handleError('Invalid or missing provider ID. Cannot delete.');
      return;
    }
    this.selectedProviderId = providerId; // Set the provider to delete
    this.showDeletePopup = true; // Show the custom pop-up instead of confirm
  }

  confirmDelete(): void {
    if (this.selectedProviderId && this.selectedProviderId !== 'unknown') {
      console.log('Attempting to delete provider with ID:', this.selectedProviderId); // Debug log
      this.apiService.deleteProviderFromCenter(this.selectedProviderId, this.centerId).subscribe({
        next: (response: ApiResponse<string>) => {
          if (response.Status === 200) {
            this.loadAllProviders(); // Reload the provider list after successful deletion
          } else {
            this.handleError(response.Message || 'Failed to delete provider. Status: ' + response.Status);
            console.log('Response Details:', response); // Log full response for debugging
          }
        },
        error: (err) => {
          this.handleError('An error occurred while deleting the provider. Please try again later. (Status: ' + (err.status || 'Unknown') + ')');
          console.error('Error Details:', err); // Log error details
        }
      });
    } // If invalid, error is handled above
    this.cancelDelete(); // Close the pop-up after action
  }

  cancelDelete(): void {
    this.showDeletePopup = false; // Hide the pop-up
    this.selectedProviderId = null; // Reset the selected provider
  }

 navigateToScheduleOptions(providerId: string | undefined): void {
    if (providerId) {
      this.router.navigate(['owner/manually-schedule', providerId]);
    } else {
      this.errorMessage = 'Provider ID is missing. Cannot navigate to schedule options.';
    }
  }

}
