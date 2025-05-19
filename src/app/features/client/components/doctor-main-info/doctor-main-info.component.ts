import { Component, inject, NgModule, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { IDoctorMainInfo } from '../../../../types/IDoctorMainInfo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-doctor-main-info',
  templateUrl: './doctor-main-info.component.html',
  styleUrls: ['./doctor-main-info.component.css'],
  imports: [ReactiveFormsModule, FormsModule, RatingModule],
})
export class DoctorMainInfoComponent implements OnInit {
  clientServices = inject(ClientService);
  mainInfo: IDoctorMainInfo = {
    FullName: '',
    Image: '',
    Specialization: '',
    Rate: 0,
    Bio: '',
  };

  ngOnInit() {
    this.clientServices.getMainInfo().subscribe({
      next: (res) => {
        this.mainInfo.FullName = res.Data.FullName;
        this.mainInfo.Image = '/images/avatar.png';
        this.mainInfo.Specialization = res.Data.Specialization;
        this.mainInfo.Rate = res.Data.Rate;
        this.mainInfo.Bio = res.Data.Bio;
      },
      error: (err) => {
        console.error('Error while fetching doctor main info:', err);
      },
    });
  }
}
