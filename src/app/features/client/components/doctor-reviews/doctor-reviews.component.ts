import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { IDoctorReviews } from '../../models/IDoctorReviews';
import { CarouselModule } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

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
  ],
})
export class DoctorReviewsComponent implements OnInit {
  clientServices = inject(ClientService);
  messageServices = inject(MessageService);

  reviews: Array<IDoctorReviews> = [];
  constructor() {}
  ngOnInit() {
    this.clientServices.getDoctorReviews().subscribe({
      next: (res) => {
        this.reviews = [...res.Data];
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
      },
    });
  }
}
