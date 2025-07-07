import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { IDoctorFilter } from '../../..//..//types/IDoctorFilter';
import { environment } from '../../../../../environments/environment';
import { IDoctorCard } from '../../models/IDoctorCard';
import { ClientFooterComponent } from '../client-footer/client-footer.component';
import { NavBarComponent } from '../navBar/navBar.component';

@Component({
  selector: 'app-doctorsPage',
  standalone: true,
  templateUrl: './doctorsPage.component.html',
  styleUrls: ['./doctorsPage.component.css'],
  imports: [CommonModule, FormsModule, ClientFooterComponent, NavBarComponent],
})
export class DoctorsPageComponent implements OnInit {
  searchText: string = '';
  specialty: string = '';
  city: string = '';
  fullImagePath: string = '';

  specialties: string[] = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
  ];
  cities: string[] = ['Cairo', 'Giza', 'Alexandria', 'Aswan'];


  selectedTitles: number[] = [];
  selectedCities: string[] = [];
  selectedGender!:any;

  filterModel: IDoctorFilter = {
    Title: undefined,
    Gender: undefined,
    City: undefined,
    MinRate: undefined,
    MaxRate: undefined,
    MinPrice: undefined,
    MaxPrice: undefined,
    AvailableDate: undefined,
  };

  doctors: IDoctorCard[] = [];
  filteredDoctors: IDoctorCard[] = [];

  constructor(
    private cardDoctorService: ClientService,
    private router: Router
  ) {}

  goToDetails(Id: number | undefined): void {
    if (!Id) {
      console.error('Invalid doctor ID');
      return;
    }
    this.router.navigate(['client/doctor-details', Id]);
  }

  ngOnInit(): void {
    this.getAllDoctors();
  }

  getAllDoctors(): void {

  }

  onTitleChange(event: any): void {
    const value = Number(event.target.value);
    if (event.target.checked) {
      this.filterModel.Title = value;
    } else {
      this.filterModel.Title = undefined;
    }
  }

  onCityChange(event: any): void {
    const value = event.target.value;

    if (event.target.checked) {
      this.selectedCities.push(value);
    } else {
      this.selectedCities = this.selectedCities.filter((c) => c !== value);
    }

    this.filterModel.City =
      this.selectedCities.length > 0 ? this.selectedCities[0] : undefined;
  }

}
