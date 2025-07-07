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
import { DoctorTitle } from '../../../../Enums/DoctorTitle.enum';
import { GenderType } from '../../../../Enums/GenderType.enum';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { buildDoctorFilter } from '../../../../utils/DoctorFilterBuilder';

@Component({
  selector: 'app-doctorsPage',
  standalone: true,
  templateUrl: './doctorsPage.component.html',
  styleUrls: ['./doctorsPage.component.css'],
  imports: [CommonModule, FormsModule, ClientFooterComponent, NavBarComponent,SelectModule, CheckboxModule],
})
export class DoctorsPageComponent implements OnInit {
  doctors: IDoctorCard[] = [];
  filteredDoctors: IDoctorCard[] = [];

  searchText: string = '';
  specialty: string = '';
  city: string = '';

  fullImagePath: string = '';
  selectedTitles: number[] = [];
  selectedGenders: number[] = [];
  selectedCities: string[] = [];
  selectedSpecializations: string[] = [];
  specialties: string[] = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
  ];
  cities: string[] = ['naser city', 'Giza', 'Alexandria', 'Aswan'];

  titles: Array<{ value: number, label: string }> = Object.entries(DoctorTitle)
    .filter(([key, value]) => typeof value === 'number' && value !== DoctorTitle.None)
    .map(([key, value]) => ({ value: value as number, label: key }));

  genders: Array<{ value: number, label: string }> = Object.entries(GenderType)
    .filter(([key, value]) => typeof value === 'number' && value !== GenderType.None)
    .map(([key, value]) => ({ value: value as number, label: key }));

  filterModel: any = {
    MinRate: undefined,
    MaxRate: undefined,
    MinPrice: undefined,
    MaxPrice: undefined,
    AvailableDate: undefined,
  };

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

  getAllDoctors(filter: Partial<IDoctorFilter>={}): void {
    debugger;
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
    if (event.target.checked) {
      if (!this.selectedTitles.includes(value)) this.selectedTitles.push(value);
    } else {
      this.selectedTitles = this.selectedTitles.filter(t => t !== value);
    }
    console.log('Selected titles:', this.selectedTitles);
    this.applyFilters();
  }

  onCityChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      if (!this.selectedCities.includes(value)) this.selectedCities.push(value);
    } else {
      this.selectedCities = this.selectedCities.filter(c => c !== value);
    }
    this.applyFilters();
  }

  onGenderChange(event: any): void {
    const value = Number(event.target.value);
    if (event.target.checked) {
      if (!this.selectedGenders.includes(value)) this.selectedGenders.push(value);
    } else {
      this.selectedGenders = this.selectedGenders.filter(g => g !== value);
    }
    console.log('Selected genders:', this.selectedGenders);
    this.applyFilters();
  }

  onSpecializationChange(specialization: string): void {
    if (specialization && !this.selectedSpecializations.includes(specialization)) {
      this.selectedSpecializations = [specialization];
    } else {
      this.selectedSpecializations = [];
    }
    this.applyFilters();
  }

  applyFilters(): void {
    const filter = {
      Titles: this.selectedTitles,
      Genders: this.selectedGenders,
      Cities: this.selectedCities,
      Specializations: this.selectedSpecializations,
      SearchText: this.searchText,
      MinRate: this.filterModel.MinRate,
      MaxRate: this.filterModel.MaxRate,
      MinPrice: this.filterModel.MinPrice,
      MaxPrice: this.filterModel.MaxPrice,
      AvailableDate: this.filterModel.AvailableDate
        ? new Date(this.filterModel.AvailableDate).toISOString().split('T')[0]
        : undefined,
    };
    console.log('Sending filter:', filter);
    this.getAllDoctors(filter);
  }

  // searchDoctors(): void {
  //   this.filterModel.SearchText = this.searchText;
  //   this.filterModel.City = this.city || undefined;
  //   this.filterModel.Specialization = this.specialty || undefined;

  //   this.applyFilters();

  //   // Reset search inputs after applying
  //   this.searchText = '';
  //   this.city = '';
  //   this.specialty = '';
  // }
}
