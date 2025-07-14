import { Component, OnInit } from '@angular/core';
import { IProviderCenterService } from '../../models/IProviderCenterService';
import { S_ServicesService } from '../../services/S_Services.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-provider-center-service',
  templateUrl: './ProviderCenterService.component.html',
  styleUrls: ['./ProviderCenterService.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProviderCenterServiceComponent implements OnInit {
  providerCenterServices: IProviderCenterService[] = [];
  filteredProviderCenterServices: IProviderCenterService[] = [];
  paginatedProviderCenterServices: IProviderCenterService[] = [];
  centerId!: number;
  loading = false;
  errorMessage = '';
  currentPage = 1;
  pageSize = 10;

  // Modal edit state
  selectedPCS: IProviderCenterService | null = null;
  editPrice: number | null = null;
  editLoading = false;
  editError = '';
  editSuccess = '';
  showEditModal = false;

  // Search/filter state
  searchProvider = '';
  filterService = '';
  uniqueServiceNames: string[] = [];

  constructor(
    private sServices: S_ServicesService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.centerId = this.authService.getCenterId();
    this.fetchProviderCenterServices();
  }

  fetchProviderCenterServices() {
    this.loading = true;
    this.sServices.getAllProviderCenterServices(this.centerId).subscribe({
      next: (res) => {
        this.providerCenterServices = res.Data;
        this.uniqueServiceNames = Array.from(
          new Set(res.Data.map((x) => x.ServiceName))
        );
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load provider center services.';
        this.loading = false;
      },
    });
  }

  applyFilters() {
    this.filteredProviderCenterServices = this.providerCenterServices.filter(
      (pcs) => {
        const matchesProvider =
          this.searchProvider.trim() === '' ||
          pcs.ProviderName.toLowerCase().includes(
            this.searchProvider.trim().toLowerCase()
          );
        const matchesService =
          this.filterService === '' || pcs.ServiceName === this.filterService;
        return matchesProvider && matchesService;
      }
    );
    this.currentPage = 1;
    this.updatePaginatedProviderCenterServices();
  }

  updatePaginatedProviderCenterServices() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProviderCenterServices =
      this.filteredProviderCenterServices.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(
      this.filteredProviderCenterServices.length / this.pageSize
    );
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProviderCenterServices();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProviderCenterServices();
    }
  }

  getPaginationEndIndex(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredProviderCenterServices.length
    );
  }

  editPCS(pcs: IProviderCenterService) {
    this.selectedPCS = pcs;
    this.editPrice = pcs.Price;
    this.editError = '';
    this.editSuccess = '';
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedPCS = null;
    this.editPrice = null;
    this.editError = '';
    this.editSuccess = '';
  }

  saveEdit() {
    if (!this.selectedPCS || this.editPrice == null) return;
    this.editLoading = true;
    this.editError = '';
    this.editSuccess = '';

    this.sServices
      .updateProviderCenterService(this.selectedPCS.Id, {
        Price: this.editPrice,
      })
      .subscribe({
        next: () => {
          this.selectedPCS!.Price = this.editPrice!;
          this.editSuccess = 'Price updated successfully!';
          this.editLoading = false;
          this.applyFilters();
          setTimeout(() => this.closeEditModal(), 1000);
          this.messageService.add({
            key: 'main-toast',
            severity: 'success',
            summary: 'Success',
            detail: 'Price updated successfully!',
          });
        },
        error: () => {
          this.editError = 'Failed to update price.';
          this.editLoading = false;
          this.messageService.add({
            key: 'main-toast',
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update price.',
          });
        },
      });
  }
}
