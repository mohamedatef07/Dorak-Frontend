import { Component, OnInit, inject } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../../../services/auth.service';
import { IClientReview } from '../../models/IClientReview';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuItem, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'app-client-reviews',
  templateUrl: './client-reviews.component.html',
  styleUrls: ['./client-reviews.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RatingModule,
    PaginatorModule,
    DatePipe,
    SplitButtonModule,
    ToastModule,
  ],
})
export class ClientReviewsComponent implements OnInit {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  userId = this.authService.getUserId();
  reviews: IClientReview[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;


  Edit(reviewId: number) {
    // this.clientService.deleteReview(reviewId).subscribe({
    //   next: (res) => {
    //     console.log('Edit Called');
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Updated',
    //       detail: 'Review updated successfully',
    //     });
    //     this.fetchReviews();
    //   },
    // });
  }

  delete(reviewId: number) {
    this.clientService.deleteReview(reviewId).subscribe({
      next: (res) => {
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          summary: 'Deleted',
          detail: 'Review deleted successfully',
          life: 4000,
        });
        this.fetchReviews();
      },
    });
  }

  ngOnInit() {
    this.fetchReviews();
  }

  fetchReviews() {
    this.clientService
      .getClientReviews(this.userId, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          if (res && res.Data) {
            this.reviews = res.Data.map((review) => {
              const reviewMenuItems: MenuItem[] = [
                {
                  label: 'Edit',
                  icon: 'pi pi-pencil',
                  command: () => {
                    this.messageService.add({
                      key: 'main-toast',
                      severity: 'success',
                      summary: 'Edit',
                      detail: `Edit clicked for Review ID: ${review.ReviewId}`,
                    });
                  },
                },
                {
                  label: 'Delete',
                  icon: 'pi pi-trash',
                  command: () => {
                    this.delete(review.ReviewId);
                  },
                },
              ];
              return { ...review, menuItems: reviewMenuItems };
            });

            this.totalRecords = res.TotalRecords;
            this.currentPage = res.CurrentPage;
            this.pageSize = res.PageSize;
            this.totalPages = res.TotalPages;
          } else {
            this.reviews = [];
            this.totalRecords = 0;
          }
        },
        error: (err) => {
          this.messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to fetch reviews',
            life: 4000,
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
