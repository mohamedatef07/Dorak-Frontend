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
import { ButtonModule } from 'primeng/button';
import { IMakeAppointment } from '../../models/IMakeAppointment';
import { AuthService } from '../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { ICheckoutRequest } from '../../models/ICheckoutRequest';
import { Router, ActivatedRoute } from '@angular/router';
  import { Input } from '@angular/core';


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
    ButtonModule,
    TimeStringToDatePipe,
  ],
})
export class BookingComponent implements OnInit {
  route = inject(Router);
  routeParam = inject(ActivatedRoute);
  clientServices = inject(ClientService);
  authServices = inject(AuthService);
  messageServices = inject(MessageService);

  checkoutRequest: ICheckoutRequest = {
    AppointmentId: 0,
    ClientId: '',
    StripeToken: '',
    Amount: 0,
  };

  centerServices: Array<IDoctorCenterServices> = [];
  services: Array<IDoctorService> = [];
  originalBookings: Array<IDoctorBookingInfo> = [];
  tempBookings: Array<IDoctorBookingInfo> = [];

  selectedCenterId: number | undefined;
  selectedServiceId: number | undefined;
  price: number | undefined = 0;
  duration: number | undefined = 0;
  userId!: string;
  EndDate!: Date;

@Input() providerId!: string;

getTotalAppointments(): number {
  return this.originalBookings.length;
}
 ngOnInit() {
  this.userId = this.authServices.getUserId();


  this.clientServices.getDoctorBookingInfo(this.providerId).subscribe({
    next: (res) => {
      this.originalBookings = [...res.Data];
      this.tempBookings = this.originalBookings;
    },
    error: (err) => {
      this.messageServices.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The server is experiencing an issue, Please try again soon.',
        life: 4000,
      });
    },
  });

  this.clientServices.getDoctorCenterServices(this.providerId).subscribe({
    next: (res) => {
      this.centerServices = [...res.Data];
    },
    error: (err) => {
      this.messageServices.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The server is experiencing an issue, Please try again soon.',
        life: 4000,
      });
    },
  });
}


  showCenterServicesAndBookings() {
    this.originalBookings = this.tempBookings;
    const center = this.centerServices.find(
      (cs) => cs.CenterId == this.selectedCenterId
    );
    this.services = center?.Services ?? [];

    const filteredBookings = this.originalBookings.filter(
      (booking) => booking.CenterId == this.selectedCenterId
    );
    this.originalBookings = [...filteredBookings];
    return;
  }

  makeAppointment(appDate: Date, shiftId: number) {
    if (!this.selectedServiceId || !this.selectedCenterId) {
      this.messageServices.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Booking incomplete: Please select a center and service.',
        life: 4000,
      });
      return;
    }

    const reservedAppointment: IMakeAppointment = {
      ProviderId: this.providerId,
      AppointmentDate: appDate,
      Fees: this.price,
      UserId: this.userId,
      ShiftId: shiftId,
      ServiceId: this.selectedServiceId,
      CenterId: this.selectedCenterId,
    };

    this.clientServices.makeAppointment(reservedAppointment).subscribe({
      next: (res) => {
        this.checkoutRequest = res.Data;
        this.messageServices.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Your appointment has been successfully reserved.',
          life: 4000,
        });
        this.selectedCenterId = 0;
        this.selectedServiceId = 0;
        this.route.navigate(['/client/checkout'], {
          state: { checkoutRequest: this.checkoutRequest }
        });
      },
      error: (err) => {
        this.messageServices.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to book appointment. Please try again later',
          life: 4000,
        });
      },
    });
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
      const url = `https://www.google.com/maps/search/?api=1&query=${center?.Latitude},${center?.Longitude}`;
      window.open(url, '_blank');
      return;
    }
    this.messageServices.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Please select a center first to open its location.',
      life: 4000,
    });
    return;
  }
}
