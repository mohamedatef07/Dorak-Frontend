import { Component, OnInit, inject } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { IClientReview } from '../../models/IClientReview';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-client-reviews',
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.css'],
  imports: [CommonModule, FormsModule, RatingModule, PaginatorModule, DatePipe],
})
export class ClientReviewsComponent implements OnInit {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  reviews: IClientReview[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;

  ngOnInit() {
    this.fetchReviews();
  }

  fetchReviews() {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.clientService
      .getClientReviews(userId, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.reviews = [...res.Data];
          this.totalRecords = res.TotalRecords;
          this.currentPage = res.CurrentPage;
          this.pageSize = res.PageSize;
          this.totalPages = res.TotalPages;
        },
        error: () => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch reviews',
          });
        },
      });
  }

  nextPage() {
    this.currentPage++;
    this.fetchReviews();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchReviews();
    }
  }

  get canGoNext(): boolean {
    return this.currentPage * this.pageSize < this.totalRecords;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get startRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }
}
