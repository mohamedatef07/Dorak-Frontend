import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { IDoctorCenterServices } from '../../../../types/IDoctorCenterServices';
import { IDoctorService } from '../../../../types/IDoctorService';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { IDoctorBookingInfo } from '../../../../types/IDoctorBookingInfo';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [SelectModule, FormsModule],
})
export class BookingComponent implements OnInit {
  clientServices = inject(ClientService);

  centerServices: Array<IDoctorCenterServices> = [];
  services: Array<IDoctorService> = [];
  bookings: Array<IDoctorBookingInfo> = [];

  selectedCenterId: number | undefined;
  selectedServiceId: number | undefined;
  price: number | undefined = 0;
  duration: number | undefined = 0;

  ngOnInit() {
    this.clientServices.getDoctorBookingInfo().subscribe({
      next: (res) => {
        this.bookings.push(...res.Data);
      },
      error: (err) => {
        console.error('Error while fetching doctor bookings:', err);
      },
    });
    this.clientServices.getDoctorCenterServices().subscribe({
      next: (res) => {
        this.centerServices.push(...res.Data);
      },
      error: (err) => {
        console.error('Error while fetching doctor center services:', err);
      },
    });
  }
  showCenterServices() {
    const center = this.centerServices.find(
      (cs) => cs.CenterId == this.selectedCenterId
    );
    if (center && center.Services) {
      this.services = center.Services;
    } else {
      this.services = [];
    }
    return;
  }
  showPriceAndDuration() {
    const service = this.services.find(
      (ser) => ser.ServiceId == this.selectedServiceId
    );
    this.price = service?.Price;
    this.duration = service?.Duration;
  }
  openMap() {
    if (this.selectedCenterId) {
      const center = this.centerServices.find(
        (cen) => cen.CenterId == this.selectedCenterId
      );
      const url = `https://www.google.com/maps?q=${center?.Latitude},${center?.Longitude}`;
      window.open(url, '_blank');
    }
    return;
  }
}
