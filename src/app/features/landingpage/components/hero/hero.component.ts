import { NgClass, NgStyle, CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { faClock, faZap, faBuilding, faCheckCircle,faCity, faBolt,faGlobe,faDesktop, faArrowRight, faChevronDown, faChevronUp, faHospital, faLandmark, faGraduationCap, faPhone, faStethoscope, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


  interface Patient {
  id: number;
  name: string;
  reason: string;
  waitTime: string;
  status: 'Waiting' | 'In Session' | 'Completed';
}

@Component({
  selector: 'app-hero',
   standalone: true,
  templateUrl: './hero.component.html',
   imports: [
    CommonModule,

],
  styleUrls: ['./hero.component.css',


  ]
})
export class HeroComponent  {
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


features: { icon: SafeHtml; title: string; description: string }[] = [];
  industries: { icon: IconDefinition; name: string; color: string }[] = [];

  constructor(private sanitizer: DomSanitizer) {
this.features = [
  {
    title: '<strong>Time-saving Experience</strong>',
    description: 'Eliminate long wait times and improve efficiency.',
    icon: this.sanitizer.bypassSecurityTrustHtml(`
      
    `)
  }
];


  }

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
  ];
  getIconClass(iconName: string): string {
  return `fa-solid ${iconName}`;
}

 isMinimized: boolean = false;

  ngAfterViewInit(): void {
    const themeToggle = document.getElementById('themeToggle') as HTMLElement;
    const icon = themeToggle?.querySelector('i') as HTMLElement;

    themeToggle?.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        icon?.classList.remove('fa-moon');
        icon?.classList.add('fa-sun');
      } else {
        icon?.classList.remove('fa-sun');
        icon?.classList.add('fa-moon');
      }
    });

    const floatingCTA = document.getElementById('floatingCTA') as HTMLElement;
    const minimizeBtn = document.getElementById('minimizeBtn') as HTMLElement;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled > 200) {
        floatingCTA?.classList.add('visible');
      } else {
        floatingCTA?.classList.remove('visible');
      }
    });

    minimizeBtn?.addEventListener('click', (event) => {
      event.stopPropagation(); // علشان مايفتحش CTA لما تضغط على minimize
      this.isMinimized = !this.isMinimized;

      const ctaContent = floatingCTA.querySelector('.cta-content') as HTMLElement;
      const minimizedContent = floatingCTA.querySelector('.minimized-content') as HTMLElement;

      if (this.isMinimized) {
        floatingCTA.classList.add('minimized');
        ctaContent.style.display = 'none';
        minimizedContent.classList.remove('d-none');
      } else {
        floatingCTA.classList.remove('minimized');
        ctaContent.style.display = 'block';
        minimizedContent.classList.add('d-none');
      }
    });

    floatingCTA?.addEventListener('click', () => {
      if (this.isMinimized) {
        this.isMinimized = false;
        const ctaContent = floatingCTA.querySelector('.cta-content') as HTMLElement;
        const minimizedContent = floatingCTA.querySelector('.minimized-content') as HTMLElement;

        floatingCTA.classList.remove('minimized');
        ctaContent.style.display = 'block';
        minimizedContent.classList.add('d-none');
      }
    });

    // Hover effects for buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .btn-cta');
    ctaButtons.forEach(button => {
      button.addEventListener('mouseenter', function () {
        // (this as HTMLElement).style.transform = 'translateY(-2px)';
      });
      button.addEventListener('mouseleave', function () {
        // (this as HTMLElement).style.transform = 'translateY(0)';
      });
    });

    // Hover effects for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        // (this as HTMLElement).style.transform = 'translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        // (this as HTMLElement).style.transform = 'translateY(0)';
      });
    });
  }



Patients: Patient[] = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    reason: 'Fever & Cough',
    waitTime: '5 min',
    status: 'Waiting'
  },
  {
    id: 2,
    name: 'Fatma Naser',
    reason: 'Routine Checkup',
    waitTime: '15 min',
    status: 'Waiting'
  },
  {
    id: 3,
    name: 'Mohamed Ali',
    reason: 'Back Pain',
    waitTime: '25 min',
    status: 'In Session'
  },
  {
    id: 4,
    name: 'Sara Mostafa',
    reason: 'Headache',
    waitTime: '35 min',
    status: 'Completed'
  }
];

 App() {
  const getStatusBadge = (status: Patient['status']) => {
    switch (status) {
      case 'Waiting':
        return 'bg-warning text-dark';
      case 'In Session':
        return 'bg-primary';
      case 'Completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };
}
getStatusBadge(status: Patient['status']): string {
  switch (status) {
    case 'Waiting':
      return 'bg-warning text-dark';
    case 'In Session':
      return 'bg-primary';
    case 'Completed':
      return 'bg-success';
    default:
      return 'bg-secondary';
  }
}


}
