import { Component, inject, OnInit } from '@angular/core';
import { DoctorMainInfoComponent } from '../doctor-main-info/doctor-main-info.component';
import { DoctorReviewsComponent } from '../doctor-reviews/doctor-reviews.component';
import { BookingComponent } from '../booking/booking.component';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { NavBarComponent } from "../navBar/navBar.component";
import { ClientFooterComponent } from "../client-footer/client-footer.component";


@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css'],
  imports: [DoctorMainInfoComponent, DoctorReviewsComponent, BookingComponent, NavBarComponent, ClientFooterComponent]
})
export class DoctorDetailsComponent implements OnInit {
  doctorId!: string;
  constructor(private route: ActivatedRoute, private _clientService: ClientService) {}

  ngOnInit() {
    this.route.paramMap.subscribe({
      next: (p) => {
        let doctorId = p.get('id');
        if (doctorId) {
          this.doctorId = doctorId;
          this._clientService.getDoctorsById(this.doctorId).subscribe({
            next: (res) => {
              console.log(res.Data);
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      }
    });
  }
}

