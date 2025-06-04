import { Component, OnInit } from '@angular/core';
import { IDoctorsCard } from '../../../../types/IDoctorsCard';
import { LandingpageServiceService } from '../../services/landingPage.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-doctors-landingPage',
  imports: [NgFor],
  templateUrl: './doctors-landingPage.component.html',
  styleUrls: ['./doctors-landingPage.component.css'],
})
export class DoctorsLandingPageComponent implements OnInit {
  doctors: IDoctorsCard[] = [];

  constructor(
    private landingservice: LandingpageServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllDoctors();
  }

  getAllDoctors(): void {
    this.landingservice.getAllDoctorsCards().subscribe({
      next: (res) => {
        this.doctors = res.Data;
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      },
    });
  }
}
