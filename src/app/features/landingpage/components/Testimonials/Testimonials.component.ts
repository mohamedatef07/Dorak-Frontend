import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, Star, Quote } from 'lucide-angular';



@Component({
  selector: 'app-Testimonials',
 imports: [CommonModule, LucideAngularModule],
  templateUrl: './Testimonials.component.html',
  styleUrls: ['./Testimonials.component.css']
})

export class TestimonialsComponent {


starIcon = Star;
  quoteIcon = Quote;

  content = {
    title: 'What Healthcare Providers Say',
    subtitle: 'Hear from medical professionals who have transformed their practice',
    testimonials: [
      {
        name: 'Dr. Sarah Ahmed',
        role: 'Chief Medical Officer',
        clinic: 'City Medical Center',
        quote: 'MedQueue Pro has revolutionized our patient flow. We\'ve reduced wait times by 60% and our patient satisfaction scores have never been higher.',
        rating: 5
      },
      {
        name: 'Dr. Omar Hassan',
        role: 'Hospital Director',
        clinic: 'Regional Health Center',
        quote: 'The real-time notifications and analytics have given us incredible insights into our operations. Our efficiency has improved dramatically.',
        rating: 5
      },
      {
        name: 'Dr. Layla Mohamed',
        role: 'Clinic Manager',
        clinic: 'Family Healthcare Clinic',
        quote: 'Easy to implement and even easier to use. Our staff adapted quickly and patients love the transparency of knowing their wait times.',
        rating: 5
      }
    ]
  };




}
