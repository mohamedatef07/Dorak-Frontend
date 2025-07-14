import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faClock, faZap, faBuilding, faCheckCircle,faCity, faBolt,faGlobe,faDesktop, faArrowRight, faChevronDown, faChevronUp, faHospital, faLandmark, faGraduationCap, faPhone, faStethoscope, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-FAQ',
  templateUrl: './FAQ.component.html',
  styleUrls: ['./FAQ.component.css'],
  imports:[CommonModule]
})
export class FAQComponent  {
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

  openFAQ: number | null = null;


  toggleFAQ(index: number): void {
    this.openFAQ = this.openFAQ === index ? null : index;
  }

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
  ]

}
