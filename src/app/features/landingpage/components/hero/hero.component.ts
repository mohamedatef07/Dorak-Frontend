import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ArrowRight,
  Play,
  Clock,
  Users,
  CheckCircle,
  Zap
} from 'lucide-angular';

@Component({
  selector: 'app-Hero',
  imports:[NgFor],
  templateUrl: './Hero.component.html',
  styleUrls: ['./Hero.component.css',
         '..//../../../styles/general.css'

  ]
})
export class HeroComponent {

 arrowRightIcon = ArrowRight;
  playIcon = Play;
  clockIcon = Clock;
  usersIcon = Users;
  checkCircleIcon = CheckCircle;
  zapIcon = Zap;

  content = {
    badge: 'Trusted by 500+ Medical Centers',
    title: 'Transform Your Medical Center with Smart Queue Management',
    subtitle: 'Reduce wait times by 50%, boost patient satisfaction, and streamline your entire appointment process with our intelligent queue management system.',
    cta1: 'Start Free Trial',
    cta2: 'Watch Demo',
    stats: [
      { number: '50%', label: 'Less Wait Time', icon: Clock },
      { number: '10,000+', label: 'Happy Patients', icon: Users },
      { number: '99.9%', label: 'Uptime', icon: Zap }
    ],
    features: [
      'Real-time notifications',
      'Doctor scheduling',
      'Patient management',
      'Analytics dashboard',
      'Mobile app included',
      'HIPAA compliant'
    ]
  };

  queueItems = [
    { id: 1, name: 'Ahmed Ali', doctor: 'Dr. Sarah', time: '5 min', status: 'current' },
    { id: 2, name: 'Fatima Hassan', doctor: 'Dr. Ahmed', time: '12 min', status: 'waiting' },
    { id: 3, name: 'Omar Khaled', doctor: 'Dr. Sarah', time: '18 min', status: 'waiting' },
    { id: 4, name: 'Layla Mohamed', doctor: 'Dr. Ahmed', time: '25 min', status: 'waiting' }
  ];

}
