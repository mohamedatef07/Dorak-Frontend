import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ChooseSystem',
  templateUrl: './HowITWork.component.html',
  styleUrls: ['./HowITWork.component.css'],
  imports:[CommonModule]
})
export class ChooseSystemComponent   {

  features: { icon: string; title: string; description: string }[] = [];
constructor() {
 this.features = [
  {
    icon: '🕒',
    title: 'Smart Queue Alerts',
    description: 'Get notified when your turn is approaching with intelligent time predictions.'
  },
  {
    icon: '⚡',
    title: 'Time-saving Experience',
    description: 'Eliminate physical waiting lines and optimize your valuable time.'
  },
  {
    icon: '🏢',
    title: 'Multi-branch Support',
    description: 'Manage queues across multiple locations from a single dashboard.'
  },
  {
    icon: '✅',
    title: 'Instant Setup',
    description: 'Get your queuing system up and running in minutes, not hours.'
  },
  {
    icon: '🖥️',
    title: 'Real-time Screens',
    description: 'Digital displays show current queue status and estimated wait times.'
  }
];
}


}
