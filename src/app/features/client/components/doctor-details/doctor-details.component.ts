import { Component, inject, OnInit } from '@angular/core';
import { DoctorMainInfoComponent } from '../doctor-main-info/doctor-main-info.component';
import { DoctorReviewsComponent } from '../doctor-reviews/doctor-reviews.component';
import { BookingComponent } from '../booking/booking.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css'],
  imports: [DoctorMainInfoComponent, DoctorReviewsComponent, BookingComponent]
})
export class DoctorDetailsComponent implements OnInit {
    doctorId!: string;

  constructor(private route: ActivatedRoute) {}


  ngOnInit() {
        this.route.paramMap.subscribe(params => {
      this.doctorId = params.get('id')!;
    });

  }
}
