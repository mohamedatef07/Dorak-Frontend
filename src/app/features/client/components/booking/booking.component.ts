import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { IDoctorCenterServices } from '../../models/IDoctorCenterServices';
import { IDoctorService } from '../../models/IDoctorService';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { IDoctorBookingInfo } from '../../models/IDoctorBookingInfo';
import { CarouselModule } from 'primeng/carousel';
import { CarouselResponsiveOptions } from 'primeng/carousel';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { IMakeAppointment } from '../../models/IMakeAppointment';
import { AuthService } from '../../../../services/auth.service';
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  imports: [
    SelectModule,
    FormsModule,
    CarouselModule,
    CommonModule,
    ToastModule,
  ],
})
export class BookingComponent implements OnInit {
  clientServices = inject(ClientService);
  authServices = inject(AuthService);

  centerServices: Array<IDoctorCenterServices> = [];
  services: Array<IDoctorService> = [];
  bookings: Array<IDoctorBookingInfo> = [];

  selectedCenterId: number | undefined;
  selectedServiceId: number | undefined;
  price: number | undefined = 0;
  duration: number | undefined = 0;
  userId!: string;

  ngOnInit() {
    this.userId = this.authServices.getUserId();
    this.clientServices.getDoctorBookingInfo().subscribe({
      next: (res) => {
        this.bookings = [...res.Data];
      },
      error: (err) => {
        console.error('Error while fetching doctor bookings:', err);
      },
    });

    this.clientServices.getDoctorCenterServices().subscribe({
      next: (res) => {
        this.centerServices = [...res.Data];
      },
      error: (err) => {
        console.error('Error while fetching doctor center services:', err);
      },
    });
  }
  showCenterServicesAndBookings() {
    const center = this.centerServices.find(
      (cs) => cs.CenterId == this.selectedCenterId
    );
    if (center && center.Services) {
      this.services = [...center.Services];
    } else {
      this.services = [];
    }

    const filteredBookings = this.bookings.filter(
      (booking) => booking.CenterId == this.selectedCenterId
    );
    this.bookings = [...filteredBookings];

    return;
  }

  makeAppointment(appDate: Date, shiftId: number) {
    if (this.selectedServiceId && this.selectedCenterId) {
      const reservedAppointment: IMakeAppointment = {
        ProviderId: this.clientServices.id,
        AppointmentDate: appDate,
        Fees: this.price,
        UserId: this.userId,
        ShiftId: shiftId,
        ServiceId: this.selectedServiceId,
        CenterId: this.selectedCenterId,
      };
      this.clientServices.makeAppointment(reservedAppointment).subscribe({
        next: (res) => {
          console.log(res);
        },
      });
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
