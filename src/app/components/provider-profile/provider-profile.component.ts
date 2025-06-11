import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { IProviderViewModel } from '../../types/IProviderViewModel';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../types/ApiResponse';

@Component({
  selector: 'app-provider-profile',
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule]
})
export class ProviderProfileComponent implements OnInit {
  provider: IProviderViewModel | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;
  selectedDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const providerId = this.route.snapshot.paramMap.get('id');
    if (providerId && providerId.trim() !== '') {
      this.loadProviderDetails(providerId);
    } else {
      this.errorMessage = 'Provider ID not found.';
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
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading provider details. (Status: ' + (err.status || 'Unknown') + ')';
        console.error('API error:', err);
      }
    });
  }

  sendInvite(): void {
    if (this.provider && this.selectedDate) {
      console.log('Sending invite to provider:', this.provider.ProviderId, 'on date:', this.selectedDate);

    } else {
      this.errorMessage = 'Please select a date before sending an invite.';
    }
  }

  onDateChange(): void {
    this.errorMessage = '';
  }

  goBack(): void {
    this.router.navigate(['/search-provider']);
  }
}
