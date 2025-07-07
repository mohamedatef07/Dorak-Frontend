import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule,
  TrendingUp,
  Users,
  Clock,
  Star,
  Award,
  Globe
} from 'lucide-angular';

@Component({
  selector: 'app-states',
  imports:[NgIf,NgFor,NgClass],
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css',
         '..//../../../styles/general.css'

  ]
})
export class StatesComponent  {


 content = {
    badge: 'Trusted Worldwide',
    title: 'Trusted by Healthcare Providers Globally',
    subtitle: 'Join thousands of medical centers already transforming their patient experience',
    stats: [
      {
        icon: Users,
        number: '500+',
        label: 'Medical Centers',
        color: 'primary',
        description: 'Active healthcare facilities'
      },
      {
        icon: Clock,
        number: '2M+',
        label: 'Appointments',
        color: 'success',
        description: 'Successfully managed'
      },
      {
        icon: TrendingUp,
        number: '85%',
        label: 'Efficiency Boost',
        color: 'info',
        description: 'Average improvement'
      },
      {
        icon: Star,
        number: '4.9/5',
        label: 'Customer Rating',
        color: 'warning',
        description: 'Based on 1000+ reviews'
      },
      {
        icon: Award,
        number: '99.9%',
        label: 'Uptime',
        color: 'danger',
        description: 'Guaranteed reliability'
      },
      {
        icon: Globe,
        number: '25+',
        label: 'Countries',
        color: 'secondary',
        description: 'Worldwide presence'
      }
    ]
  };
}




