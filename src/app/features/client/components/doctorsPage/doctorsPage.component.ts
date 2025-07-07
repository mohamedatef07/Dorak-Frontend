import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { IDoctorFilter } from '../../..//..//types/IDoctorFilter';
import { environment } from '../../../../../environments/environment';
import { IDoctorCard } from '../../models/iDoctorcard';
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

  titles = [
    { value: 1, label: 'Professor' },
    { value: 2, label: 'Lecturer' },
    { value: 3, label: 'Consultant' },
    { value: 4, label: 'Specialist' },
  ];

  genders = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' },
  ];

  filterModel: IDoctorFilter = {
    Title: undefined,
    Gender: undefined,
    City: undefined,
    SearchText: undefined,
    Specialization: undefined,
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

  getAllDoctors(filter?: Partial<IDoctorFilter>): void {
    this.cardDoctorService.getAllDoctorsCards(filter).subscribe({
      next: (res) => {
        this.doctors = [...res.Data];
        if (this.doctors[0]?.Image) {
          this.fullImagePath = `${environment.apiUrl}${this.doctors[0].Image}`;
        }
        this.filteredDoctors = [...this.doctors];
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      },
    });
  }

  onTitleChange(event: any): void {
    const value = Number(event.target.value);
    this.filterModel.Title = event.target.checked ? value : undefined;
    this.applyFilters();
  }

  onCityChange(event: any): void {
    const value = event.target.value;
    this.filterModel.City = event.target.checked ? value : undefined;
    this.applyFilters();
  }

  onGenderChange(event: any): void {
    const value = Number(event.target.value);
    this.filterModel.Gender = value;
    this.applyFilters();
  }

  onSpecializationChange(specialization: string): void {
    this.filterModel.Specialization = specialization || undefined;
    this.applyFilters();
  }

  applyFilters(): void {
    // Clean up the filter model by removing undefined values
    const cleanFilter: Partial<IDoctorFilter> = {};
    Object.entries(this.filterModel).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        cleanFilter[key as keyof IDoctorFilter] = value;
      }
    });

    // If there are no filters, get all doctors
    if (Object.keys(cleanFilter).length === 0) {
      this.getAllDoctors();
      return;
    }

    this.getAllDoctors(cleanFilter);
  }

  searchDoctors(): void {
    this.filterModel.SearchText = this.searchText;
    this.filterModel.City = this.city || undefined;
    this.filterModel.Specialization = this.specialty || undefined;

    this.applyFilters();

    // Reset search inputs after applying
    this.searchText = '';
    this.city = '';
    this.specialty = '';
  }
}
