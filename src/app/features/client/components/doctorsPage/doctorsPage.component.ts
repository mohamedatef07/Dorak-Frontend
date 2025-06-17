
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { IDoctorFilter } from '../../..//..//types/IDoctorFilter';
import { IDoctorcard } from '../../models/idoctorcard';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-doctorsPage',
  standalone: true,
  templateUrl: './doctorsPage.component.html',
  styleUrls: ['./doctorsPage.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class DoctorsPageComponent implements OnInit {
  searchText: string = '';
  specialty: string = '';
  city: string = '';

  specialties: string[] = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics'];
  cities: string[] = ['Cairo', 'Giza', 'Alexandria', 'Aswan'];

  titles = [
    { value: 1, label: 'Professor' },
    { value: 2, label: 'Lecturer' },
    { value: 3, label: 'Consultant' },
    { value: 4, label: 'Specialist' }
  ];

  genders = [
    { value: 1, label: 'Male' },
    { value: 2, label: 'Female' }
  ];

 selectedTitles: number[] = [];
  selectedCities: string[] = [];
  selectedGender: number | undefined;

 filterModel: IDoctorFilter = {
  Title: undefined,
  Gender: undefined,
  City: undefined,
  MinRate: undefined,
  MaxRate: undefined,
  MinPrice: undefined,
  MaxPrice: undefined,
  AvailableDate: undefined
};


  doctors: IDoctorcard[] = [];
  filteredDoctors: IDoctorcard[] = [];

  constructor(private cardDoctorService: ClientService , private router: Router) {}


goToDetails(Id: number | undefined): void {
  if (!Id) {
    console.error("Invalid doctor ID");
    return;
  }
  this.router.navigate(['client/doctor-details', Id]);
}

  ngOnInit(): void {
    this.getAllDoctors();
  }

  getAllDoctors(): void {
    this.cardDoctorService.getAllDoctorsCards().subscribe({
      next: (res) => {
        this.doctors = res.Data;
        console.log(res.Data);
this.doctors.forEach((doctor) => {
  doctor.Image = environment.apiUrl + doctor.Image;
});
        this.filteredDoctors = [...this.doctors];
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });
  }

  onTitleChange(event: any): void {
  const value = Number(event.target.value);
  if (event.target.checked) {
    this.filterModel.Title = value;
  } else {
    this.filterModel.Title = undefined;
  }
  this.applyFilters();
}


   onCityChange(event: any): void {
  const value = event.target.value;

  if (event.target.checked) {
    this.selectedCities.push(value);
  } else {
    this.selectedCities = this.selectedCities.filter(c => c !== value);
  }

  this.filterModel.City = this.selectedCities.length > 0 ? this.selectedCities[0] : undefined;

  this.applyFilters();
}

   onGenderChange(event: any): void {
  const value = Number(event.target.value);
  this.filterModel.Gender = value || undefined;
  this.applyFilters();
}

applyFilters(): void {
  const noFiltersApplied =
    !this.filterModel.Title &&
    !this.filterModel.Gender &&
    this.selectedCities.length === 0 &&
    this.filterModel.MinRate === undefined &&
    this.filterModel.MaxRate === undefined &&
    this.filterModel.MinPrice === undefined &&
    this.filterModel.MaxPrice === undefined &&
    !this.filterModel.AvailableDate;

  if (noFiltersApplied) {
    this.getAllDoctors();
    return;
  }

  const rawBody: IDoctorFilter = {
    Title: this.filterModel.Title,
    Gender: this.filterModel.Gender,
    City: this.selectedCities[0],
    MinRate: this.filterModel.MinRate,
    MaxRate: this.filterModel.MaxRate,
    MinPrice: this.filterModel.MinPrice,
    MaxPrice: this.filterModel.MaxPrice,
    AvailableDate: this.filterModel.AvailableDate
  };

  const body: Partial<IDoctorFilter> = {};

for (const key in rawBody) {
  const typedKey = key as keyof IDoctorFilter;
  const value = rawBody[typedKey];

  if (value !== undefined && value !== null) {
    (body as any)[typedKey] = value;
  }
}


  this.cardDoctorService.searchDoctorsByFilter(body).subscribe({
    next: (res) => {
      this.filteredDoctors = res.Data;
    },
    error: (err) => console.error("Filter error: ", err)
  });
}


searchDoctors(): void {
  this.cardDoctorService.getAllDoctorsCards().subscribe({
    next: (res) => {
      this.doctors = res.Data;
      const keyword = this.searchText.trim().toLowerCase();
      const selectedCity = this.city.trim().toLowerCase();
      const selectedSpecialty = this.specialty.trim().toLowerCase();

      this.filteredDoctors = this.doctors.filter(doc => {
        const nameMatch = doc.FullName.toLowerCase().includes(keyword);
        const cityMatch = selectedCity ? doc.City.toLowerCase().includes(selectedCity) : true;
        const specialtyMatch = selectedSpecialty ? doc.Specialization.toLowerCase().includes(selectedSpecialty) : true;
        return nameMatch && cityMatch && specialtyMatch;
      });

      this.searchText = '';
      this.city = '';
      this.specialty = '';
    },
    error: (err) => {
      console.error('Error during search:', err);
    }
  });
}

}
