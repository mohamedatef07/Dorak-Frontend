import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-Help-Support',
  templateUrl: './Help-Support.component.html',
  styleUrls: ['./Help-Support.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AccordionModule,
    CardModule,
    ChipModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class HelpSupportComponent implements OnInit {
  
  searchQuery = '';
  selectedCategory = 'all';
  expandedItems: Set<number> = new Set();
  public currentYear: number = new Date().getFullYear();

  // FAQ Categories
  categories = [
    { label: 'All Topics', value: 'all' },
    { label: 'Getting Started', value: 'getting-started' },
    { label: 'Account Management', value: 'account' },
    { label: 'Queue Management', value: 'queue' },
    { label: 'Appointments', value: 'appointments' },
    { label: 'Technical Issues', value: 'technical' },
    { label: 'Billing & Pricing', value: 'billing' }
  ];

  // FAQ Data
  faqData = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I register my medical center with Dorak?',
      answer: 'To register your medical center, visit our registration page and fill out the required information including center details, owner information, and user credentials. Our team will review your application and activate your account within 24-48 hours.',
      tags: ['registration', 'setup', 'center']
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What are the system requirements for using Dorak?',
      answer: 'Dorak is a web-based application that works on any modern browser (Chrome, Firefox, Safari, Edge). You need a stable internet connection and a device with a screen resolution of at least 1024x768. No software installation is required.',
      tags: ['requirements', 'browser', 'compatibility']
    },
    {
      id: 3,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address, and we\'ll send you a password reset link. The link will expire in 24 hours for security purposes.',
      tags: ['password', 'security', 'login']
    },
    {
      id: 4,
      category: 'account',
      question: 'Can I have multiple users for my medical center?',
      answer: 'Yes! You can add multiple operators and providers to your center. Each user can have different permission levels - administrators can manage all aspects, while operators can only handle queue management and basic operations.',
      tags: ['users', 'permissions', 'operators']
    },
    {
      id: 5,
      category: 'queue',
      question: 'How does the smart queue management work?',
      answer: 'Our smart queue system automatically optimizes patient flow based on appointment times, provider availability, and patient priority levels. It reduces wait times and improves overall efficiency by intelligently scheduling and managing patient queues.',
      tags: ['queue', 'smart', 'optimization']
    },
    {
      id: 6,
      category: 'queue',
      question: 'Can I manually adjust the queue order?',
      answer: 'Yes, administrators and operators can manually adjust queue positions for urgent cases or special circumstances. Simply drag and drop patients in the queue or use the priority override feature.',
      tags: ['manual', 'priority', 'override']
    },
    {
      id: 7,
      category: 'appointments',
      question: 'How do patients book appointments?',
      answer: 'Patients can book appointments through your center\'s public booking page, which you can customize with your branding. They can select available time slots, choose providers, and receive confirmation emails automatically.',
      tags: ['booking', 'patients', 'scheduling']
    },
    {
      id: 8,
      category: 'appointments',
      question: 'Can I set different appointment durations?',
      answer: 'Absolutely! You can configure different appointment types with varying durations (15, 30, 45, 60 minutes, etc.). Each provider can have their own schedule and appointment types.',
      tags: ['duration', 'types', 'providers']
    },
    {
      id: 9,
      category: 'technical',
      question: 'What should I do if the system is slow?',
      answer: 'First, check your internet connection. Clear your browser cache and cookies. If the issue persists, try using a different browser or contact our technical support team at dorak.helpdesk@gmail.com with details about the issue.',
      tags: ['performance', 'troubleshooting', 'support']
    },
    {
      id: 10,
      category: 'technical',
      question: 'Is my patient data secure?',
      answer: 'Yes, we take data security seriously. All data is encrypted in transit and at rest. We comply with healthcare data protection regulations and regularly conduct security audits. Your patient information is never shared with third parties.',
      tags: ['security', 'privacy', 'compliance']
    },
    {
      id: 11,
      category: 'billing',
      question: 'What are the pricing plans?',
      answer: 'We offer flexible pricing plans based on your center size and needs. Contact our sales team for a personalized quote. We also offer a free trial period so you can evaluate the system before committing.',
      tags: ['pricing', 'plans', 'trial']
    },
    {
      id: 12,
      category: 'billing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your data will be available for export for 30 days after cancellation.',
      tags: ['cancellation', 'subscription', 'data']
    }
  ];


  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  // Get filtered FAQ data
  get filteredFaqData() {
    let filtered = this.faqData;

    // Filter by category
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }

  // Toggle FAQ item expansion
  toggleItem(id: number) {
    if (this.expandedItems.has(id)) {
      this.expandedItems.delete(id);
    } else {
      this.expandedItems.add(id);
    }
  }

  // Check if item is expanded
  isExpanded(id: number): boolean {
    return this.expandedItems.has(id);
  }

  // Clear search
  clearSearch() {
    this.searchQuery = '';
  }

  // Contact support
  contactSupport() {
    this.messageService.add({
      severity: 'info',
      summary: 'Contact Support',
      detail: 'Please visit our Contact Us page or email us at dorak.helpdesk@gmail.com',
      life: 5000
    });
  }

  // Get category label
  getCategoryLabel(value: string): string {
    const category = this.categories.find(cat => cat.value === value);
    return category ? category.label : value;
  }

  // Get category count
  getCategoryCount(categoryValue: string): number {
    return this.faqData.filter(item => item.category === categoryValue).length;
  }
}
