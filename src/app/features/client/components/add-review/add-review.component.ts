import { AuthService } from './../../../../services/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { IClientReview } from '../../models/IClientReview';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { IDoctorMainInfo } from '../../models/IDoctorMainInfo';
import { environment } from '../../../../../environments/environment';
import { IAddReview } from '../../models/IAddReview';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, AvatarModule],
})
export class AddReviewComponent implements OnInit {
  authService = inject(AuthService);
  route = inject(ActivatedRoute);
  clientService = inject(ClientService);
  router = inject(Router);
  messageService = inject(MessageService);

  providerId!: string;
  rate: number = 0;
  review: string = '';
  submitting = false;

  // For doctor info display
  doctorInfo: IDoctorMainInfo = {
    FullName: '',
    Image: '',
    Specialization: '',
    Rate: 0,
    Bio: '',
  };
  fullImagePath: string = ``;
  imageLoadFailed = false;
  userId = this.authService.getUserId();

  constructor() {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('providerId');
      if (id) {
        this.providerId = id;
        this.fetchDoctorInfo();
      }
    });
  }

  fetchDoctorInfo() {
    this.clientService.getMainInfo(this.providerId).subscribe({
      next: (res) => {
        this.doctorInfo = {
          FullName: res.Data.FullName,
          Image: res.Data.Image ? environment.apiUrl + res.Data.Image : '',
          Specialization: res.Data.Specialization,
          Rate: res.Data.Rate,
          Bio: res.Data.Bio,
        };
        this.fullImagePath = this.doctorInfo.Image;
      },
      error: () => {
        this.imageLoadFailed = true;
      },
    });
  }

  onImageError() {
    this.imageLoadFailed = true;
  }

  submitReview() {
    if (!this.rate || !this.review.trim()) {
      this.messageService.add({
        key: 'main-toast',
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please provide a rating and review description.',
        life: 4000,
      });
      return;
    }
    this.submitting = true;
    const reviewObj: IAddReview = {
      ProviderId: this.providerId, // If backend expects ProviderId, adjust accordingly
      Description: this.review,
      Rating: this.rate,
      ClientId: this.userId,
    };
    this.clientService.AddReview(reviewObj).subscribe({
      next: (res) => {
        this.messageService.add({
          key: 'main-toast',
          severity: 'success',
          summary: 'Success',
          detail: 'Review submitted successfully!',
          life: 4000,
        });
        this.router.navigate(['/client/doctor-details', this.providerId]);
      },
      error: (err) => {
        this.messageService.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to submit review. Please try again.',
          life: 4000,
        });
        this.submitting = false;
      },
    });
  }
}
