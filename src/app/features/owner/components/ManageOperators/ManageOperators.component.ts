import { Component, inject, Inject, OnInit } from '@angular/core';
import { OwnerService } from '../../services/owner.service';
import { IOperator } from '../../../../types/IOperator';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../../../types/ApiResponse';


@Component({
  selector: 'app-ManageOperators',
  templateUrl: './ManageOperators.component.html',
  styleUrls: ['./ManageOperators.component.css'],
  imports: [CommonModule],
})
export class ManageOperatorsComponent implements OnInit {
  private ownerService = inject(OwnerService);
  operators: IOperator[] = [];
  centerId = 1;

  constructor() { }

  ngOnInit() {
    this.ownerService.getOperatorsByCenterId(this.centerId).subscribe({
      next: (res: ApiResponse<IOperator[]>) => {
        this.operators = res.Data || [];
      },
      error: (err: any) => {
        console.error('Error while fetching operators:', err);
      },
    });
  }
}
