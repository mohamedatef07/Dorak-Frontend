import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, UserPlus, Calendar, Bell, CheckCircle } from 'lucide-angular';


@Component({
  selector: 'app-HowITWork',
  imports:[NgClass,LucideAngularModule,NgFor],
  templateUrl: './HowITWork.component.html',
  styleUrls: ['./HowITWork.component.css',
         '..//../../../styles/general.css'

  ]
})
export class HowITWorkComponent  {


content = {
    title: 'How It Works',
    subtitle: 'Simple steps to revolutionize your medical center',
    steps: [
      {
        icon: UserPlus,
        title: 'Patient Registration',
        description: 'Patients register online or at the center with their basic information and medical history.',
        color: 'primary'
      },
      {
        icon: Calendar,
        title: 'Book Appointment',
        description: 'Choose from available time slots and doctors based on specialization and availability.',
        color: 'success'
      },
      {
        icon: Bell,
        title: 'Real-time Updates',
        description: 'Receive notifications when your turn approaches and get real-time queue updates.',
        color: 'info'
      },
      {
        icon: CheckCircle,
        title: 'Visit Complete',
        description: 'Complete your visit efficiently with reduced wait times and improved experience.',
        color: 'warning'
      }
    ]
  };

}
