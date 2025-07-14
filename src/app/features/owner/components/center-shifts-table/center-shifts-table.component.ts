import { AuthService } from './../../../../services/auth.service';
import { ICenterShifts } from './../../models/ICenterShifts';
import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TimeStringToDatePipe } from '../../../../pipes/TimeStringToDate.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner.service';
import { ButtonModule } from 'primeng/button';
import { UpdateShiftsListSRService } from '../../../../services/signalR Services/updateShiftsListSR.service';
import { ShiftType } from '../../../../Enums/ShiftType.enum';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'app-center-shifts-table',
  imports: [TimeStringToDatePipe, DatePipe, ButtonModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './center-shifts-table.component.html',
  styleUrl: './center-shifts-table.component.css',
})
export class CenterShiftsTableComponent {
  messageServices = inject(MessageService);
  ownerServices = inject(OwnerService);
  authServices = inject(AuthService);
  confirmService = inject(ConfirmationService);
  srService = inject(UpdateShiftsListSRService);
  route = inject(Router);
  centerShifts: Array<ICenterShifts> = [];
  centerId = this.authServices.getCenterId();
  ShiftType = ShiftType;
  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  totalPages: number = 0;
  loading: boolean = false;
  private pendingRequests: number = 0;

  ngOnInit() {
    this.loading = true;
    this.loadCenterShifts();
    this.srService.updatedShiftsList.subscribe({
      next: (PaginationupdatedList) => {
        this.centerShifts = [...PaginationupdatedList.Data];
        this.totalRecords = PaginationupdatedList.TotalRecords;
        this.totalPages = PaginationupdatedList.TotalPages;
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
        if (this.currentPage < 1) {
          this.currentPage = 1;
        }
        this.decrementLoader();
      },
      error: (err) => {
        this.messageServices.add({
          key: 'main-toast',
          severity: 'error',
          summary: 'Error',
          detail: 'The server is experiencing an issue, Please try again soon.',
          life: 4000,
        });
        this.decrementLoader();
      },
    });
  }
  startShift(shift: ICenterShifts) {
    const shiftDate = new Date(shift.ShiftDate + ' ' + shift.StartTime);
    if (
      shiftDate <= new Date() &&
      shiftDate.getDate() === new Date().getDate()
    ) {
      this.ownerServices.startShift(shift.ShiftId).subscribe({
        next: (res) => {
          this.route.navigate(['owner/provider-live-queue', shift.ShiftId]);
          this.decrementLoader();
        },
        error: (err) => {
          this.messageServices.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail:
              'The server is experiencing an issue, Please try again soon.',
            life: 4000,
          });
          this.decrementLoader();
        },
      });
    } else {
      this.messageServices.add({
        key: 'main-toast',
        severity: 'info',
        summary: 'info',
        detail: `This shift isn't ready to start just yet. Please wait for its scheduled time.`,
        life: 4000,
      });
    }
  }
  cancelShift(shiftId: number, event: Event) {
    this.confirmService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to cancel this shift?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ownerServices.cancelShift(shiftId, this.centerId).subscribe({
          error: (err) => {
            this.messageServices.add({
              key: 'main-toast',
              severity: 'error',
              summary: 'Error',
              detail:
                'The server is experiencing an issue, Please try again soon.',
              life: 4000,
            });
            this.decrementLoader();
          },
        });
      },
    });
  }
  shiftDetails(shiftId: number, shiftStatus: ShiftType) {
    if (shiftStatus === ShiftType.OnGoing) {
      this.route.navigate(['owner/provider-live-queue', shiftId]);
    } else if (shiftStatus === ShiftType.Completed) {
      this.route.navigate(['owner/shift-details', shiftId]);
    }
  }

  loadCenterShifts() {
    this.ownerServices
      .getAllCenterShifts(this.centerId, this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.centerShifts = [...res.Data];
          this.totalRecords = res.TotalRecords;
          this.totalPages = res.TotalPages;
          this.decrementLoader();
        },
        error: (err) => {
          this.messageServices.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail:
              'The server is experiencing an issue, Please try again soon.',
            life: 4000,
          });
          this.decrementLoader();
        },
      });
  }
  nextPage() {
    this.currentPage++;
    this.loadCenterShifts();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCenterShifts();
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

  get filteredCenterShifts() {
    return this.centerShifts.filter(s => s.ShiftType !== ShiftType.Completed);
  }
  private decrementLoader() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }
}
