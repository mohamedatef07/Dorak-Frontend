import { Component, inject, Inject, OnInit } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { IOperator } from '../../models/IOperator';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../../types/ApiResponse';
import { AuthService } from '../../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ManageOperators',
  templateUrl: './ManageOperators.component.html',
  styleUrls: ['./ManageOperators.component.css'],
  imports: [CommonModule, ToastModule, FormsModule],
  providers: [MessageService]
})
export class ManageOperatorsComponent implements OnInit {
  private ownerService = inject(OwnerService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  operators: IOperator[] = [];
  paginatedOperators: IOperator[] = [];
  currentPage = 1;
  pageSize = 5;
  get totalPages(): number {
    return Math.ceil(this.operators.length / this.pageSize);
  }
  centerId = 1;
  searchTerm: string = '';
  filteredOperators: IOperator[] = [];
  constructor() { }
  
  ngOnInit() {
    this.centerId = this.authService.getCenterId() || 1;
    this.ownerService.getOperatorsByCenterId(this.centerId).subscribe({
      next: (res: ApiResponse<IOperator[]>) => {
        this.operators = [...res.Data];
        this.filteredOperators = [...this.operators];
        this.updatePaginatedOperators();
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error while fetching operators.'
        });
      },
    });
  }

  DeleteOperator(OperatorId:string):void {
    console.log(OperatorId);
    if (!confirm('Are you sure you want to delete this operator?')) {
    return;
  }

  this.ownerService.deleteOperatorById(OperatorId).subscribe({
    next: (res) => {
      this.operators = this.operators.filter(op => op.OperatorId !== OperatorId);
      this.filteredOperators = this.filteredOperators.filter(op => op.OperatorId !== OperatorId);
      this.updatePaginatedOperators();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Operator deleted successfully.'
      });
    },
    error: (err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete operator. Please try again.'
      });
    }
  });
  }

  updatePaginatedOperators() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOperators = this.filteredOperators.slice(startIndex, endIndex);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOperators();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOperators();
    }
  }

  getPaginationEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.operators.length);
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredOperators = [...this.operators];
    } else {
      this.filteredOperators = this.operators.filter(op =>
        op.FirstName.toLowerCase().includes(term) ||
        op.LastName.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.updatePaginatedOperators();
  }
}