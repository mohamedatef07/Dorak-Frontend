import { Component, inject, Input, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { IDoctorMainInfo } from '../../models/IDoctorMainInfo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-doctor-main-info',
  standalone: true,
  templateUrl: './doctor-main-info.component.html',
  styleUrls: ['./doctor-main-info.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RatingModule,
    AvatarModule,
  ],
})
export class DoctorMainInfoComponent implements OnInit {
  clientServices = inject(ClientService);
  messageServices = inject(MessageService);

  @Input() providerId!: string;

  mainInfo: IDoctorMainInfo = {
    FullName: '',
    Image: '',
    Specialization: '',
    Rate: 0,
    Bio: '',
  };

  fullImagePath: string = '';
  imageLoadFailed = false;

  ngOnInit() {
    this.clientServices.getMainInfo(this.providerId).subscribe({
      next: (res) => {
        this.mainInfo = {
          FullName: res.Data.FullName,
          Image: res.Data.Image ? environment.apiUrl + res.Data.Image : '',
          Specialization: res.Data.Specialization,
          Rate: res.Data.Rate,
          Bio: res.Data.Bio,
        };
        this.fullImagePath = this.mainInfo.Image;
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
        this.imageLoadFailed = true;
      },
    });
  }

  onImageError() {
    this.imageLoadFailed = true;
  }
}
