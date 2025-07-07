import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Calendar,
  Bell,
  Clock,
  Users,
  BarChart3,
  Shield,
  Smartphone,
  Zap
} from 'lucide-angular';

@Component({
  selector: 'app-Features',
  imports:[NgClass,CommonModule],
  templateUrl: './Features.component.html',
  styleUrls: ['./Features.component.css',
         '..//../../../styles/general.css'

  ]
})
export class FeaturesComponent{

content = {
    title: 'Everything You Need to Manage Your Medical Center',
    subtitle: 'Powerful features designed specifically for healthcare providers',
    features: [
      {
        icon: Calendar,
        title: 'Smart Scheduling',
        description: 'Intelligent appointment scheduling with conflict detection and automatic optimization.',
        color: 'primary'
      },
      {
        icon: Bell,
        title: 'Real-time Notifications',
        description: 'Keep patients informed with SMS and push notifications about their queue status.',
        color: 'success'
      },
      {
        icon: Clock,
        title: 'Wait Time Prediction',
        description: 'AI-powered wait time estimates help patients plan their visit better.',
        color: 'info'
      },
      {
        icon: Users,
        title: 'Patient Management',
        description: 'Comprehensive patient profiles with medical history and preferences.',
        color: 'warning'
      },
      {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Detailed insights into queue performance, patient flow, and doctor efficiency.',
        color: 'danger'
      },
      {
        icon: Shield,
        title: 'HIPAA Compliant',
        description: 'Enterprise-grade security ensuring patient data privacy and compliance.',
        color: 'secondary'
      },
      {
        icon: Smartphone,
        title: 'Mobile App',
        description: 'Native mobile apps for both patients and healthcare providers.',
        color: 'dark'
      },
      {
        icon: Zap,
        title: 'Instant Updates',
        description: 'Real-time synchronization across all devices and platforms.',
        color: 'primary'
      }
    ]
  };
}


