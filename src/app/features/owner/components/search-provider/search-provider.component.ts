import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../services/api.service';
import { IPaginationViewModel } from '../../../../types/IPaginationViewModel';
import { IProviderViewModel } from '../../../../types/IProviderViewModel';
import { ApiResponse } from '../../../../types/ApiResponse';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-search-provider',
  templateUrl: './search-provider.component.html',
  styleUrls: ['./search-provider.component.css'],
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
    MatButtonModule
  ]
})
export class SearchProviderComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'city', 'phoneNumber', 'specialization'];
  dataSource = new MatTableDataSource<IProviderViewModel>([]);

  @ViewChild(MatTable) table: MatTable<IProviderViewModel> | undefined;
  @ViewChild('tableElement') tableElement: ElementRef | undefined;

  providers: IProviderViewModel[] = [];
  specializations: string[] = ['Cardiology', 'Pediatrics', 'Orthopedics'];

  totalItems: number = 0;
  pageSize: number = 9;
  pageIndex: number = 0;
  specializationFilter: string = '';
  searchText: string = '';
  sortFilter: string = '';
  centerId: number = 0;

  errorMessage: string = '';
  isLoading: boolean = false;
  sortBy: string = 'AddDate';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.centerId = this.authService.getCenterId();
    this.loadProviders();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called at:', new Date().toISOString());
    this.cdr.detectChanges();
  }

  loadProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.dataSource = new MatTableDataSource<IProviderViewModel>([]);

    const pageNumber = this.pageIndex + 1;
    console.log('Sending API request with params:', {
      page: pageNumber,
      pageSize: this.pageSize,
      specializationFilter: this.specializationFilter,
      searchText: this.searchText,
      centerId: this.centerId
    });

    this.apiService.searchProviders(
      pageNumber,
      this.pageSize,
      '',
      this.specializationFilter,
      this.searchText,
      this.centerId
    ).subscribe({
      next: (response: ApiResponse<IPaginationViewModel<IProviderViewModel>>) => {
        this.isLoading = false;
        console.log('API response:', response);
        if (response.Status === 200 && response.Data?.Data) {
          const providerData = response.Data.Data.$values || (response.Data.Data as unknown as IProviderViewModel[]);
          this.providers = providerData.map(provider => ({
            AssignmentId: provider.AssignmentId ?? 0,
            ProviderId: provider.ProviderId ?? '',
            FirstName: provider.FirstName ?? 'Unknown',
            LastName: provider.LastName ?? '',
            Specialization: provider.Specialization ?? 'N/A',
            Bio: provider.Bio ?? '',
            ExperienceYears: provider.ExperienceYears ?? 0,
            LicenseNumber: provider.LicenseNumber ?? '',
            Gender: provider.Gender ?? 0,
            Street: provider.Street ?? '',
            City: provider.City ?? '',
            Governorate: provider.Governorate ?? '',
            Country: provider.Country ?? '',
            BirthDate: provider.BirthDate ?? '',
            Image: provider.Image ?? '',
            Availability: provider.Availability ?? '',
            EstimatedDuration: provider.EstimatedDuration ?? 0,
            AddDate: provider.AddDate ? this.formatDate(provider.AddDate) : 'N/A',
            Email: provider.Email ?? 'N/A',
            PhoneNumber: provider.PhoneNumber ?? 'N/A',
            Status: provider.Status ?? 0
          }));
          this.totalItems = response.Data.Total || 0;
          console.log('Total items from API:', this.totalItems);
          console.log('Mapped providers:', this.providers);
          this.dataSource = new MatTableDataSource<IProviderViewModel>(this.providers);
          console.log('dataSource.data after update:', this.dataSource.data);
          console.log('Data source row count:', this.dataSource.data.length);
          this.cdr.detectChanges();
          if (this.table) {
            console.log('Forcing table renderRows at:', new Date().toISOString());
            this.table.renderRows();
            if (this.tableElement && this.tableElement.nativeElement) {
              const rows = this.tableElement.nativeElement.querySelectorAll('mat-row').length;
              console.log('DOM row count after render:', rows);
            } else {
              console.warn('Table element not found in DOM at:', new Date().toISOString());
            }
          } else {
            console.warn('Table reference not initialized at:', new Date().toISOString());
          }
        } else {
          this.errorMessage = response.Message || 'Failed to load providers.';
          this.dataSource = new MatTableDataSource<IProviderViewModel>([]);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading providers. Please try again later. (Status: ' + (err.status || 'Unknown') + ')';
        console.error('API error:', err);
        this.dataSource = new MatTableDataSource<IProviderViewModel>([]);
        this.cdr.detectChanges();
      }
    });
  }
applyFilters(): void {
    let filteredProviders = [...this.providers];

    if (this.sortFilter) {
      filteredProviders.sort((a, b) => {
        if (this.sortFilter === 'Name') return `${a.FirstName} ${a.LastName}`.localeCompare(`${b.FirstName} ${b.LastName}`);
        return 0;
      });
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  onSpecializationFilterChange(event: any): void {
    console.log('Specialization filter changed to:', event);
    this.specializationFilter = event === 'All' ? '' : event;
    this.pageIndex = 0;
    this.loadProviders();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.loadProviders();
    }
  }

  nextPage(): void {
    const maxPageIndex = Math.ceil(this.totalItems / this.pageSize) - 1;
    if (this.pageIndex < maxPageIndex) {
      this.pageIndex++;
      this.loadProviders();
    }
  }

  onSearch(): void {
    this.pageIndex = 0;
    this.loadProviders();
  }

  resetFilters(): void {
    this.specializationFilter = '';
    this.searchText = '';
    this.pageIndex = 0;
    this.loadProviders();
  }

  addProvider(): void
  {
    this.router.navigate(['owner/add-provider']);
  }

  viewProfile(providerId: string): void {
    this.router.navigate(['owner/provider-profile', providerId]);
  }

  getDisplayRange(): string {
    const start = (this.pageIndex * this.pageSize) + 1;
    const end = Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
    return `${start}-${end}`;
  }

  onSortChange(event: string): void {
    this.sortBy = event;
    this.pageIndex = 0;
    // You may want to pass sortBy to your API if supported, otherwise sort locally:
    if (this.sortBy === 'Name') {
      this.providers.sort((a, b) => {
        const nameA = ((a.FirstName || '') + ' ' + (a.LastName || '')).trim().toLowerCase();
        const nameB = ((b.FirstName || '') + ' ' + (b.LastName || '')).trim().toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else {
      // Default: sort by AddDate descending (if available)
      this.providers.sort((a, b) => {
        if (!a.AddDate || !b.AddDate) return 0;
        return new Date(b.AddDate).getTime() - new Date(a.AddDate).getTime();
      });
    }
    this.dataSource = new MatTableDataSource<IProviderViewModel>(this.providers);
    this.cdr.detectChanges();
  }

  onSortFilterChange(event: string): void {
    this.sortFilter = event;
    this.pageIndex = 0;
    this.applyFilters();
  }

}
