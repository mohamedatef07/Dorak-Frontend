import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-Terms-Conditions',
  templateUrl: './Terms-Conditions.component.html',
  styleUrls: ['./Terms-Conditions.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TermsConditionsComponent implements OnInit, OnDestroy {

  // Terms content sections
  termsSections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using the Dorak Queue Management System ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: '2. Description of Service',
      content: `Dorak provides a comprehensive queue management system for healthcare facilities, including appointment scheduling, patient queue management, provider management, and real-time status updates. The Service is designed to streamline healthcare operations and improve patient experience.`
    },
    {
      title: '3. User Accounts and Registration',
      content: `To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account.`
    },
    {
      title: '4. Acceptable Use Policy',
      content: `You agree not to use the Service to: (a) violate any applicable laws or regulations; (b) infringe upon the rights of others; (c) transmit harmful, offensive, or inappropriate content; (d) attempt to gain unauthorized access to the Service or other systems; (e) interfere with the proper functioning of the Service.`
    },
    {
      title: '5. Privacy and Data Protection',
      content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. We are committed to protecting your personal data in accordance with applicable data protection laws.`
    },
    {
      title: '6. Healthcare Data and HIPAA Compliance',
      content: `As a healthcare service provider, we are committed to maintaining the confidentiality and security of protected health information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA) and other applicable healthcare privacy laws.`
    },
    {
      title: '7. Service Availability',
      content: `We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We will provide reasonable notice for scheduled maintenance.`
    },
    {
      title: '8. Intellectual Property Rights',
      content: `The Service and its original content, features, and functionality are owned by Dorak and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.`
    },
    {
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by law, Dorak shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your use of the Service.`
    },
    {
      title: '10. Indemnification',
      content: `You agree to defend, indemnify, and hold harmless Dorak and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.`
    },
    {
      title: '11. Termination',
      content: `We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.`
    },
    {
      title: '12. Governing Law',
      content: `These Terms shall be governed by and construed in accordance with the laws of Saudi Arabia, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved in the courts of Saudi Arabia.`
    },
    {
      title: '13. Changes to Terms',
      content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.`
    },
    {
      title: '14. Contact Information',
      content: `If you have any questions about these Terms and Conditions, please contact us at dorak.helpdesk@gmail.com or through our Contact Us page.`
    }
  ];

  // Last updated date
  lastUpdated = '';
  private dateSubscription?: Subscription;
  private termsHash = '';

  constructor() { }

  ngOnInit() {
    this.updateLastUpdatedDate();
    this.updateTermsHash();
    
    // Update date every 5 seconds for testing (you can remove this after testing)
    this.dateSubscription = interval(5000).subscribe(() => {
      this.checkForTermsChanges();
    });
  }

  ngOnDestroy() {
    if (this.dateSubscription) {
      this.dateSubscription.unsubscribe();
    }
  }

  // Update the last updated date to current date
  private updateLastUpdatedDate() {
    const today = new Date();
    this.lastUpdated = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Create a hash of terms sections to detect changes
  private updateTermsHash() {
    this.termsHash = JSON.stringify(this.termsSections);
  }

  // Check if terms sections have changed
  private checkForTermsChanges() {
    const currentHash = JSON.stringify(this.termsSections);
    if (currentHash !== this.termsHash) {
      this.updateLastUpdatedDate();
      this.updateTermsHash();
    }
  }

  // Method to update date when terms sections change
  updateTermsSection(index: number, newContent: string) {
    this.termsSections[index].content = newContent;
    this.updateLastUpdatedDate(); // Update timestamp when content changes
  }

  // Method to add new terms section
  addTermsSection(title: string, content: string) {
    this.termsSections.push({ title, content });
    this.updateLastUpdatedDate(); // Update timestamp when content changes
  }

  // Method to remove terms section
  removeTermsSection(index: number) {
    this.termsSections.splice(index, 1);
    this.updateLastUpdatedDate(); // Update timestamp when content changes
  }

  // Scroll to top function
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
} 