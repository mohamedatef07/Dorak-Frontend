import { NgClass, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faClock, faZap, faBuilding, faCheckCircle,faCity, faBolt,faGlobe,faDesktop, faArrowRight, faChevronDown, faChevronUp, faHospital, faLandmark, faGraduationCap, faPhone, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-Hero',
  templateUrl: './Hero.component.html',
   imports: [
    FontAwesomeModule 
  ],
  styleUrls: ['./Hero.component.css',
         '..//../../../styles/general.css'

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
    {
      icon: this.faGlobe,
      title: 'Multi-language Interface',
      description: 'Support for Arabic, English, and other languages for diverse customers.'
    }
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
      question: 'Does it support Arabic and English?',
      answer: 'Yes, our system supports multiple languages including Arabic and English, with easy language switching for both staff and customers.'
    },
    {
      question: 'Can I use it without internet?',
      answer: 'The system can work offline for basic queue management, but internet connectivity is required for advanced features like SMS notifications and remote monitoring.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Yes, we provide both iOS and Android mobile apps for customers to join queues remotely and receive notifications.'
    },
    {
      question: 'How quickly can we set it up?',
      answer: 'Our system can be set up within 30 minutes. We provide complete installation support and training for your staff.'
    },
    {
      question: 'What hardware do we need?',
      answer: 'You only need a computer or tablet for the admin panel and optional display screens. We can recommend compatible hardware based on your needs.'
    }
  ];

}
