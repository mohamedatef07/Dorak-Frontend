import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../../../types/ApiResponse';

@Component({
  selector: 'app-add-operator',
  templateUrl: './AddOperator.component.html',
  imports:[ReactiveFormsModule]
})
export class AddOperatorComponent implements OnInit {
  AddOperatorForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.AddOperatorForm = new FormGroup({
      userName: new FormControl('',Validators.required),
      email: new FormControl('',Validators.required),
      phoneNumber: new FormControl('',Validators.required), 
      password: new FormControl('',Validators.required), 
      confirmPassword: new FormControl('',Validators.required), 
      role: new FormControl('Operator'), 
      firstName: new FormControl('',Validators.required), 
      lastName: new FormControl('',Validators.required), 
      gender: new FormControl('',Validators.required), 
      centerId: new FormControl('1',Validators.required), 
    });
  }

  ngOnInit(): void{
    
  }

  HandleSubmitForm(){
    console.log(this.AddOperatorForm);
    console.log(this.AddOperatorForm.value);

    const formData = new FormData();

    for (const key in this.AddOperatorForm.value) {
      if (this.AddOperatorForm.value.hasOwnProperty(key)) {
        formData.append(key, this.AddOperatorForm.value[key]);
      }
    }

    this.http.post<ApiResponse<any>>('https://api/Account/Register', formData).subscribe({
      next: (res) => {
        console.log('Registration success:', res.Message);
      },
      error: (err) => {
        console.error('Registration failed:', err);
      }
    });
  }
}
