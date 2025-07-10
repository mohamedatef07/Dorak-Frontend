import { NgClass, NgStyle, CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faClock, faZap, faBuilding, faCheckCircle,faCity, faBolt,faGlobe,faDesktop, faArrowRight, faChevronDown, faChevronUp, faHospital, faLandmark, faGraduationCap, faPhone, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-Hero',
   standalone: true,
  templateUrl: './Hero.component.html',
   imports: [
    FontAwesomeModule ,
  CommonModule,
  NgFor
  ],
  styleUrls: ['./Hero.component.css',


  ]
})
export class HeroComponent  {

    // Icons
  faArrowRight = faArrowRight;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faClock = faClock;
  faUsers = faUsers;
  faBuilding = faBuilding;
  faBolt = faBolt;
  faDesktop = faDesktop;
  faGlobe = faGlobe;
  faMobileAlt = faMobileAlt;
  faCheckCircle = faCheckCircle;
  faHospital = faHospital;
  faLandmark = faLandmark;
  faGraduationCap = faGraduationCap;
  faPhone = faPhone;
  faStethoscope = faStethoscope;
  faCity = faCity;

  // FAQs toggle
  openFAQ: number | null = null;

  toggleFAQ(index: number): void {
    this.openFAQ = this.openFAQ === index ? null : index;
  }

  // Features
  features = [
    {
      icon: this.faClock,
      title: 'Smart Queue Alerts',
      description: 'Get notified when your turn is approaching with intelligent time predictions.'
    },
    {
      icon: this.faBolt,
      title: 'Time-saving Experience',
      description: 'Eliminate physical waiting lines and optimize your valuable time.'
    },
    {
      icon: this.faBuilding,
      title: 'Multi-branch Support',
      description: 'Manage queues across multiple locations from a single dashboard.'
    },
    {
      icon: this.faCheckCircle,
      title: 'Instant Setup',
      description: 'Get your queuing system up and running in minutes, not hours.'
    },
    {
      icon: this.faDesktop,
      title: 'Real-time Screens',
      description: 'Digital displays show current queue status and estimated wait times.'
    },

  ];

  // Industries
  industries = [
    { icon: this.faHospital, name: 'Hospitals', color: 'text-danger' },
    { icon: this.faLandmark, name: 'Banks', color: 'text-success' },
    { icon: this.faCity, name: 'Government', color: 'text-primary' },
    { icon: this.faPhone, name: 'Telecom', color: 'text-purple' },
    { icon: this.faStethoscope, name: 'Clinics', color: 'text-info' },
    { icon: this.faGraduationCap, name: 'Universities', color: 'text-warning' }
  ];

  // FAQs
  faqs = [

    {
      question: 'Can I use it without internet?',
      answer: 'No, the system cannot operate completely without the internet. An electronic connection is required to enable some advanced features, such as notifications, remote monitoring, and custom data updates.'
    },

    {
      question: 'How quickly can we set it up?',
      answer: 'Our system can be set up within 2 days. We provide complete installation support and training for your staff.'
    },
    {
      question: 'What hardware do we need?',
      answer: 'You only need a computer or tablet for the admin panel and optional display screens. We can recommend compatible hardware based on your needs.'
    }
  ];

}
