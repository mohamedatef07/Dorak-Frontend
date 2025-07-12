import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { IDoctorReviews } from '../../models/IDoctorReviews';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
  import { Input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-doctor-reviews',
  templateUrl: './doctor-reviews.component.html',
  styleUrls: ['./doctor-reviews.component.css'],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RatingModule,
    CarouselModule,
    CommonModule,
    ProgressSpinnerModule,
  ],
})
export class DoctorReviewsComponent implements OnInit {
  clientServices = inject(ClientService);
  messageServices = inject(MessageService);
  loading: boolean = false;
  reviews: Array<IDoctorReviews> = [];
  constructor() {}

@Input() providerId!: string;
  ngOnInit() {
    this.loading = true;
    this.clientServices.getDoctorReviews(this.providerId).subscribe({
      next: (res) => {
        this.reviews = [...res.Data];
        this.loading = false;
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
        this.loading = false;
      },
    });
  }
}
