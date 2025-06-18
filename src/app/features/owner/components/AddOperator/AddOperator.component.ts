import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../../types/ApiResponse';
import { OwnerService } from '../../services/owner.service';
import { CommonModule } from '@angular/common';
import { IAddOperator } from '../../models/IAddOperator';

@Component({
  selector: 'app-add-operator',
  templateUrl: './AddOperator.component.html',
  imports: [ReactiveFormsModule, CommonModule]
})
export class AddOperatorComponent implements OnInit {
  private ownerService = inject(OwnerService);
  AddOperatorForm: FormGroup;
  genders = ['Male', 'Female'];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.AddOperatorForm = new FormGroup({
      UserName: new FormControl('', Validators.required),
      Email: new FormControl('', Validators.required),
      PhoneNumber: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
      ConfirmPassword: new FormControl('', Validators.required),
      Role: new FormControl('Operator'),
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      // image: [''],
      Gender: new FormControl('', Validators.required),
      CenterId: new FormControl('1', Validators.required),
    });
  }

  ngOnInit(): void {

  }

  HandleSubmitForm() {

    console.log(this.AddOperatorForm);
    console.log(this.AddOperatorForm.value);

    if (this.AddOperatorForm.invalid) {
      this.AddOperatorForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const operatorData = new FormData();
    Object.entries(this.AddOperatorForm.value).forEach(([key, value]) => {
      operatorData.append(key, value as string);
    });

    this.ownerService.addOperatorByCenterId(operatorData).subscribe({
      next: (response: ApiResponse<IAddOperator>) => {
        this.isSubmitting = false;
        if (response.Status == 200) {
          this.successMessage = 'Operator added successfully!';
        } else {
          this.errorMessage = response.Message || 'Failed to add operator.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'An error occurred while adding the operator.';
        console.error('Error:', error);
      }
    });
  }

}
