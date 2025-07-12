import { Component, inject, OnInit } from '@angular/core';
import { ProviderService } from '../../services/provider.service';
import { IProviderReviews } from '../../models/IProviderReviews';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-provider-reviews',
  templateUrl: './provider-reviews.component.html',
  styleUrls: ['./provider-reviews.component.css'],
  imports: [ReactiveFormsModule, FormsModule, RatingModule, CommonModule],
})
export class ProviderReviewsComponent implements OnInit {
  providerServices = inject(ProviderService);
  messageServices = inject(MessageService);

  reviews: Array<IProviderReviews> = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;

  constructor() {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.providerServices
      .getAllReviews(this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          if (res && res.Data) {
            this.reviews = [...res.Data];
            this.totalRecords = res.TotalRecords;
            this.currentPage = res.CurrentPage;
            this.pageSize = res.PageSize;
            this.totalPages = res.TotalPages;
            console.log(res.Data);
          } else {
            this.reviews = [];
            this.totalRecords = 0;
          }
        },
        error: (err) => {
          this.messageServices.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail:
              'The server is experiencing an issue, Please try again soon.',
            life: 4000,
          });
        },
      });
  }

  nextPage() {
    this.currentPage++;
    this.loadReviews();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReviews();
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
