import { Component, OnInit } from '@angular/core';

interface Doctor {
  id: string;
  name: string;
  mobile: string;
  specialization: string;
}

@Component({
  selector: 'app-delete-provider',
  templateUrl: './delete-provider.component.html',
  styleUrls: ['./delete-provider.component.css']
})
export class DeleteProviderComponent implements OnInit {
  doctors: Doctor[] = [
    { id: '00001', name: 'John Doe', mobile: '1234567810', specialization: 'Internal Medicine' },
    { id: '00002', name: 'John Doe', mobile: '1234567810', specialization: 'Internal Medicine' },
    { id: '00003', name: 'John Doe', mobile: '1234567810', specialization: 'Internal Medicine' },
    { id: '00004', name: 'John Doe', mobile: '1234567810', specialization: 'Internal Medicine' },
    { id: '00005', name: 'John Doe', mobile: '1234567810', specialization: 'Internal Medicine' },
    { id: '00006', name: 'John Doe', mobile: '1234567810', specialization: 'Internal Medicine' }
  ];

  constructor() { }

  ngOnInit(): void { }

  viewProfile(doctor: Doctor): void {
    console.log(`Viewing profile of ${doctor.name}`);
  }

  deleteDoctor(doctor: Doctor): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctors = this.doctors.filter(d => d.id !== doctor.id);
    }
  }
}
