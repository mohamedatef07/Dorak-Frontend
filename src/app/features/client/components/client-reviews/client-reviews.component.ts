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
  totalRecords = 0;
  pageSize = 6;
  currentPage = 1;
  loading = false;

  ngOnInit() {
    this.fetchReviews();
  }

  fetchReviews(page: number = 1) {
    this.loading = true;
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.clientService.getClientReviews(userId, page, this.pageSize).subscribe({
      next: (res) => {
        this.reviews = res.Data;
        this.totalRecords = res.TotalRecords;
        this.currentPage = res.CurrentPage;
        this.loading = false;
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

  onPageChange(event: any) {
    this.fetchReviews(event.page + 1);
  }

  onEditReview(review: IClientReview) {
    console.log('Edit review:', review);
  }
}
