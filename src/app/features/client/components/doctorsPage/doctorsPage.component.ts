import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';
import { IDoctorFilter } from '../../..//..//types/IDoctorFilter';
import { environment } from '../../../../../environments/environment';

import { ClientFooterComponent } from '../client-footer/client-footer.component';
import { NavBarComponent } from '../navBar/navBar.component';
import { DoctorTitle } from '../../../../Enums/DoctorTitle.enum';
import { GenderType } from '../../../../Enums/GenderType.enum';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IDoctorCard } from '../../models/iDoctorcard';



@Component({
  selector: 'app-doctorsPage',
  standalone: true,
  templateUrl: './doctorsPage.component.html',
  styleUrls: ['./doctorsPage.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ClientFooterComponent,
    NavBarComponent,
    SelectModule,
    CheckboxModule,
    AvatarModule,
    RatingModule,
    FloatLabelModule,
    MultiSelectModule,
    DatePickerModule,
    ProgressSpinnerModule,
  ],
})
export class DoctorsPageComponent implements OnInit {
  doctors: IDoctorCard[] = [];
  filteredDoctors: IDoctorCard[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalRecords: number = 0;
  totalPages: number = 0;
  searchText: string = '';
  specialty: string = '';
  city: string = '';
  fullImagePath: string = `${environment.apiUrl}`;
  imageLoadFailedMap: { [id: number]: boolean } = {};
  maxPriceValue = 10000;
  minPriceValue = 0;
  maxRateValue = 5;
  minRateValue = 0;

  loading: boolean = false;
  selectedTitles: number[] = [];
  selectedGenders: number[] = [];
  selectedCities: string[] = [];
  selectedSpecializations: string[] = [];
  selectedMinRate: number | null = null;
  selectedMaxRate: number | null = null;
  selectedMinPrice: number | null = null;
  selectedMaxPrice: number | null = null;
  selectedAvailableDate: Date | null = null;

  specializations: string[] = [];
  cities: string[] = [];

  titles: Array<{ value: number; label: string }> = Object.entries(DoctorTitle)
    .filter(
      ([key, value]) => typeof value === 'number' && value !== DoctorTitle.None
    )
    .map(([key, value]) => ({ value: value as number, label: key }));

  genders: Array<{ value: number; label: string }> = Object.entries(GenderType)
    .filter(
      ([key, value]) => typeof value === 'number' && value !== GenderType.None
    )
    .map(([key, value]) => ({ value: value as number, label: key }));

  constructor(
    private doctorServices: ClientService,
    private router: Router,
    private messageService: MessageService
  ) {}

  goToDetails(Id: number | undefined): void {
    if (!Id) {
      return;
    }
    this.router.navigate(['client/doctor-details', Id]);
  }

  ngOnInit(): void {
    this.loading = true;
    this.getAllDoctors();
    this.doctorServices.GetAllCitiesAndSpecializations().subscribe({
      next: (res) => {
        this.cities = res.Data.Cities;
        this.specializations = res.Data.Specializations;
      },
    });
  }

  getAllDoctors(filter: Partial<IDoctorFilter> = {}): void {
    this.doctorServices
      .getAllDoctorsCards(filter, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {

          this.doctors = [...res.Data];
          this.filteredDoctors = [...this.doctors];
          this.totalRecords = res.TotalRecords;
          this.currentPage = res.CurrentPage;
          this.pageSize = res.PageSize;
          this.totalPages = res.TotalPages;
          this.loading = false;
        },
      });
  }

  onTitleChange(event: any): void {
    const value = Number(event.target.value);
    if (event.target.checked) {
      if (!this.selectedTitles.includes(value)) {
        this.selectedTitles.push(value);
      }
    } else {
      this.selectedTitles = this.selectedTitles.filter((t) => t !== value);
    }
    this.applyFilters();
  }

  onGenderChange(event: any): void {
    const value = Number(event.target.value);
    if (event.target.checked) {
      if (!this.selectedGenders.includes(value))
        this.selectedGenders.push(value);
    } else {
      this.selectedGenders = this.selectedGenders.filter((g) => g !== value);
    }
    this.applyFilters();
  }
  onCityChange(selectedCities: string[]): void {
    this.selectedCities = selectedCities;
    this.applyFilters();
  }

  onSpecializationChange(selectedSpecializations: string[]): void {
    this.selectedSpecializations = selectedSpecializations; // This will allow handling multiple selected specializations
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.selectedMinRate !== null) {
      if (this.selectedMinRate > this.maxRateValue) {
        this.selectedMinRate = this.maxRateValue;
      }
      if (this.selectedMinRate < this.minRateValue) {
        this.selectedMinRate = this.minRateValue;
      }
    }
    if (this.selectedMaxRate !== null) {
      if (this.selectedMaxRate < this.minRateValue) {
        this.selectedMaxRate = this.minRateValue;
      }
      if (this.selectedMaxRate > this.maxRateValue) {
        this.selectedMaxRate = this.maxRateValue;
      }
    }
    if (this.selectedMinPrice !== null) {
      if (this.selectedMinPrice > this.maxPriceValue) {
        this.selectedMinPrice = this.maxPriceValue;
      }
      if (this.selectedMinPrice < this.minPriceValue) {
        this.selectedMinPrice = this.minPriceValue;
      }
    }
    if (this.selectedMaxPrice !== null) {
      if (this.selectedMaxPrice < this.minPriceValue) {
        this.selectedMaxPrice = this.minPriceValue;
      }
      if (this.selectedMaxPrice > this.maxPriceValue) {
        this.selectedMaxPrice = this.maxPriceValue;
      }
    }
    const filter = {
      Titles: this.selectedTitles,
      Genders: this.selectedGenders,
      Cities: this.selectedCities,
      Specializations: this.selectedSpecializations,
      SearchText: this.searchText,
      MinRate: this.selectedMinRate ?? undefined,
      MaxRate: this.selectedMaxRate ?? undefined,
      MinPrice: this.selectedMinPrice ?? undefined,
      MaxPrice: this.selectedMaxPrice ?? undefined,
      AvailableDate: this.selectedAvailableDate
        ? new Date(this.selectedAvailableDate).toISOString().split('T')[0]
        : undefined,
    };
    this.getAllDoctors(filter);
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  resetFilters(): void {
    this.selectedTitles = [];
    this.selectedGenders = [];
    this.selectedCities = [];
    this.selectedSpecializations = [];
    this.selectedMinRate = null;
    this.selectedMaxRate = null;
    this.selectedMinPrice = null;
    this.selectedMaxPrice = null;
    this.selectedAvailableDate = null;
    this.searchText = '';
    this.applyFilters();
  }
  nextPage() {
    this.currentPage++;
    this.getAllDoctors();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllDoctors();
    }
  }

  get canGoNext(): boolean {
    return this.currentPage * this.pageSize < this.totalRecords;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get startRecord(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }
  onImageError(event: Event, doctorId: number) {
    this.imageLoadFailedMap[doctorId] = true;
  }
  hasImageLoadFailed(doctorId: number): boolean {
    return !!this.imageLoadFailedMap[doctorId];
  }
}
