import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cta',
  templateUrl: './cta.component.html',
  styleUrls: ['./cta.component.css',
    '../../../../styles/general.css'

  ]
})
export class CtaComponent {
  // arrowRightIcon = ArrowRight;
  // checkCircleIcon = CheckCircle;
  // zapIcon = Zap;

  content = {
    badge: 'Get Started Today',
    title: 'Ready to Transform Your Medical Center?',
    subtitle: 'Join hundreds of healthcare providers who have already revolutionized their patient experience with MedQueue Pro.',
    features: [
      'Free 30-day trial',
      'No setup fees',
      'Cancel anytime',
      '24/7 support included'
    ],
    cta1: 'Start Free Trial',
    cta2: 'Book a Demo',
    guarantee: '30-day money-back guarantee'
  };


  };








