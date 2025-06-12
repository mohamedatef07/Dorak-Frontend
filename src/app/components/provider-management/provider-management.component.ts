// import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, RouterLink, RouterModule } from '@angular/router';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatTableModule } from '@angular/material/table';
// import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
// import { MatButtonModule } from '@angular/material/button';
// import { MatTableDataSource } from '@angular/material/table';
// import { ApiService } from '../../services/api.service';
// import { IPaginationViewModel } from '../../types/IPaginationViewModel';
// import { IProviderViewModel } from '../../types/IProviderViewModel';
// import { IProviderAssignmentViewModel } from '../../types/IProviderAssignmentViewModel';
// import { ApiResponse } from '../../types/ApiResponse';

// @Component({
//   selector: 'app-provider-management',
//   templateUrl: './provider-management.component.html',
//   styleUrls: ['./provider-management.component.css'],
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     RouterModule,
//     RouterLink,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatTableModule,
//     MatSortModule,
//     MatButtonModule
//   ]
// })
// export class ProviderManagementComponent implements OnInit, AfterViewInit {
//   displayedColumns: string[] = ['id', 'name', 'phoneNumber', 'specialization', 'status'];
//   dataSource: MatTableDataSource<IProviderViewModel & { assignment?: IProviderAssignmentViewModel }> =
//     new MatTableDataSource<IProviderViewModel & { assignment?: IProviderAssignmentViewModel }>([]);

//   providers: (IProviderViewModel & { assignment?: IProviderAssignmentViewModel })[] = [];
//   specializations: string[] = ['All', 'Cardiology', 'Pediatrics', 'Orthopedics'];

//   totalItems: number = 0;
//   pageSize: number = 9;
//   pageIndex: number = 0;
//   sortBy: string = 'AddDate';
//   specializationFilter: string = '';

//   errorMessage: string = '';
//   isLoading: boolean = false;
//   centerId: number = 1;

//   constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

//   ngOnInit(): void {
//     this.loadProviders();
//   }

//   ngAfterViewInit(): void {
//     this.cdr.detectChanges();
//   }

//   loadProviders(): void {
//     this.isLoading = true;
//     this.errorMessage = '';
//     this.dataSource.data = [];

//     console.log('Sending API request with params:', {
//       centerId: this.centerId,
//       page: this.pageIndex + 1,
//       pageSize: this.pageSize,
//       sortBy: this.sortBy,
//       specializationFilter: this.specializationFilter
//     });

//     this.apiService.getProviders(
//       this.centerId,
//       this.pageIndex + 1,
//       this.pageSize,
//       this.sortBy,
//       this.specializationFilter
//     ).subscribe({
//       next: (response: ApiResponse<IPaginationViewModel<IProviderViewModel & { Assignments?: IProviderAssignmentViewModel[] }>>) => {
//         this.isLoading = false;
//         console.log('Full API response:', JSON.stringify(response, null, 2));
//         if (response.Status === 200 && response.Data?.Data) {
//           this.providers = (response.Data.Data as unknown as (IProviderViewModel & { Assignments?: IProviderAssignmentViewModel[] })[])
//             .map((provider: IProviderViewModel & { Assignments?: IProviderAssignmentViewModel[] }) => {
//               console.log('Provider:', provider.ProviderId, 'Assignments:', provider.Assignments);
//               const assignment = provider.Assignments && provider.Assignments.length > 0 ? provider.Assignments[0] : undefined;
//               console.log('Selected assignment for provider', provider.ProviderId, ':', assignment);
//               return {
//                 AssignmentId: provider.AssignmentId,
//                 ProviderId: provider.ProviderId,
//                 FirstName: provider.FirstName || 'Unknown',
//                 LastName: provider.LastName || '',
//                 Specialization: provider.Specialization || 'N/A',
//                 Bio: provider.Bio || '',
//                 ExperienceYears: provider.ExperienceYears ?? 0,
//                 LicenseNumber: provider.LicenseNumber || '',
//                 Gender: provider.Gender || 0,
//                 Street: provider.Street || '',
//                 City: provider.City || '',
//                 Governorate: provider.Governorate || '',
//                 Country: provider.Country || '',
//                 BirthDate: provider.BirthDate || '',
//                 Image: provider.Image || '',
//                 Availability: provider.Availability || '',
//                 EstimatedDuration: provider.EstimatedDuration || 0,
//                 AddDate: provider.AddDate ? this.formatDate(provider.AddDate) : 'N/A',
//                 Email: provider.Email || 'N/A',
//                 PhoneNumber: provider.PhoneNumber || 'N/A',
//                 Status: provider.Status ?? 1,
//                 assignment: assignment
//               };
//             });
//           this.totalItems = response.Data.Total || 0;
//           console.log('Mapped providers:', this.providers);
//           this.dataSource.data = [...this.providers];
//           setTimeout(() => {
//             this.cdr.detectChanges();
//           }, 0);
//         } else {
//           this.errorMessage = response.Message || 'Failed to load providers.';
//           this.dataSource.data = [];
//           this.cdr.detectChanges();
//         }
//       },
//       error: (err) => {
//         this.isLoading = false;
//         this.errorMessage = 'An error occurred while loading providers. Please try again later. (Status: ' + (err.status || 'Unknown') + ')';
//         console.error('API error:', err);
//         this.dataSource.data = [];
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   formatDate(dateStr: string): string {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
//   }

//   onSortChange(sort: Sort): void {
//     this.sortBy = sort.active === 'phoneNumber' ? 'AddDate' : sort.active;
//     this.pageIndex = 0;
//     this.loadProviders();
//   }

//   onSpecializationFilterChange(event: any): void {
//     console.log('Specialization filter changed to:', event);
//     this.specializationFilter = event === 'All' ? '' : event;
//     this.pageIndex = 0;
//     this.loadProviders();
//   }

//   previousPage(): void {
//     if (this.pageIndex > 0) {
//       this.pageIndex--;
//       this.loadProviders();
//     }
//   }

//   nextPage(): void {
//     const maxPageIndex = Math.ceil(this.totalItems / this.pageSize) - 1;
//     if (this.pageIndex < maxPageIndex) {
//       this.pageIndex++;
//       this.loadProviders();
//     }
//   }

//   resetFilters(): void {
//     this.sortBy = 'AddDate';
//     this.specializationFilter = '';
//     this.pageIndex = 0;
//     this.loadProviders();
//   }

//   getDisplayRange(): string {
//     const start = (this.pageIndex * this.pageSize) + 1;
//     const end = Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
//     return `${start}-${end}`;
//   }
// }

import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
import { ApiService } from '../../services/api.service';
import { IPaginationViewModel } from '../../types/IPaginationViewModel';
import { IProviderViewModel } from '../../types/IProviderViewModel';
import { ApiResponse } from '../../types/ApiResponse';

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
  specializations: string[] = ['All', 'Cardiology', 'Pediatrics', 'Orthopedics'];

  totalItems: number = 0;
  pageSize: number = 9;
  pageIndex: number = 0;
  sortBy: string = 'AddDate';
  specializationFilter: string = '';

  errorMessage: string = '';
  isLoading: boolean = false;
  centerId: number = 1; // Consider making this dynamic if center context varies

  constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
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
        console.log(`Page ${page} API response:`, response);
        if (response.Status === 200 && response.Data?.Data) {
          const newProviders = (response.Data.Data as unknown as IProviderViewModel[]).map((provider: IProviderViewModel) => ({
            AssignmentId: provider.AssignmentId,
            ProviderId: provider.ProviderId || `unknown-${Math.random()}`,
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

          const totalPages = Math.ceil((response.Data.Total || 0) / this.pageSize);
          console.log(`Total pages: ${totalPages}, Current page: ${page}, Total providers so far: ${this.providers.length}`);

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
        console.error('API error:', err);
      }
    });
  }

  deduplicateAndPaginate(): void {
    this.isLoading = false;
    const providerMap = new Map<string, IProviderViewModel>();
    this.providers.forEach((provider) => {
      const providerId = provider.ProviderId || `unknown-${Math.random()}`;
      if (!providerMap.has(providerId)) {
        providerMap.set(providerId, provider);
      } else {
        console.log(`Duplicate ProviderId ${providerId} found, keeping first entry`);
      }
    });

    this.providers = Array.from(providerMap.values());
    this.totalItems = this.providers.length;
    console.log('Distinct providers count:', this.providers.length);
    console.log('Distinct providers:', this.providers);


    const startIndex = this.pageIndex * this.pageSize;
    const paginatedProviders = this.providers.slice(startIndex, startIndex + this.pageSize);
    this.dataSource.data = [...paginatedProviders];
    console.log('Paginated dataSource.data:', this.dataSource.data);

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  handleError(message: string): void {
    this.isLoading = false;
    this.errorMessage = message;
    this.dataSource.data = [];
    this.cdr.detectChanges();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  onSortChange(sort: Sort): void {
    this.sortBy = sort.active === 'phoneNumber' ? 'AddDate' : sort.active;
    this.pageIndex = 0;
    this.loadAllProviders();
  }

  onSpecializationFilterChange(event: any): void {
    console.log('Specialization filter changed to:', event);
    this.specializationFilter = event === 'All' ? '' : event;
    this.pageIndex = 0;
    this.loadAllProviders();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.applyPagination();
    }
  }

  nextPage(): void {
    const maxPageIndex = Math.ceil(this.totalItems / this.pageSize) - 1;
    if (this.pageIndex < maxPageIndex) {
      this.pageIndex++;
      this.applyPagination();
    }
  }

  resetFilters(): void {
    this.sortBy = 'AddDate';
    this.specializationFilter = '';
    this.pageIndex = 0;
    this.loadAllProviders();
  }

  applyPagination(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const paginatedProviders = this.providers.slice(startIndex, startIndex + this.pageSize);
    this.dataSource.data = [...paginatedProviders];
    this.cdr.detectChanges();
  }

  getDisplayRange(): string {
    const start = (this.pageIndex * this.pageSize) + 1;
    const end = Math.min((this.pageIndex + 1) * this.pageSize, this.totalItems);
    return `${start}-${end}`;
  }

  navigateToScheduleOptions(providerId: string | undefined): void {
    if (providerId) {
      this.router.navigate(['/schedule-options', providerId]);
    } else {
      this.errorMessage = 'Provider ID is missing. Cannot navigate to schedule options.';
    }
  }
}
