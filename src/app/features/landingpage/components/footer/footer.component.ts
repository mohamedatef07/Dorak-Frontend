import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports:[CommonModule,NgFor],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css',
         '..//../../../styles/general.css'

  ]
})
export class FooterComponent  {


  // stethoscopeIcon = Stethoscope;
  // mailIcon = Mail;
  // phoneIcon = Phone;
  // mapPinIcon = MapPin;
  // facebookIcon = Facebook;
  // twitterIcon = Twitter;
  // linkedinIcon = Linkedin;
  // instagramIcon = Instagram;
  // arrowUpIcon = ArrowUp;
  // heartIcon = Heart;
  // shieldIcon = Shield;
  // awardIcon = Award;

  // socialIcons = [
  //   { icon: Facebook, name: 'Facebook', color: 'primary' },
  //   { icon: Twitter, name: 'Twitter', color: 'info' },
  //   { icon: Linkedin, name: 'LinkedIn', color: 'primary' },
  //   { icon: Instagram, name: 'Instagram', color: 'danger' }
  // ];

  content = {
    brand: 'MedQueue Pro',
    tagline: 'Revolutionizing healthcare queue management with cutting-edge technology',
    sections: {
      product: {
        title: 'Product',
        links: ['Features', 'Pricing', 'API Documentation', 'Integrations', 'Mobile Apps', 'Security']
      },
      company: {
        title: 'Company',
        links: ['About Us', 'Careers', 'Press Kit', 'Contact', 'Blog', 'News']
      },
      support: {
        title: 'Support',
        links: ['Help Center', 'Documentation', 'Training', 'Status', 'Community', 'Tutorials']
      },
      legal: {
        title: 'Legal',
        links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Security', 'Cookie Policy', 'GDPR']
      }
    },
    contact: {
      title: 'Get in Touch',
      email: 'hello@medqueuepro.com',
      phone: '+1 (555) 123-4567',
      address: '123 Healthcare Ave, Medical District, NY 10001'
    },
    social: {
      title: 'Follow Us'
    },
    newsletter: {
      title: 'Stay Updated',
      subtitle: 'Get the latest updates and healthcare insights',
      placeholder: 'Enter your email',
      button: 'Subscribe'
    },
    badges: [
      // { icon: Shield, text: 'HIPAA Compliant' },
      // { icon: Award, text: 'ISO 27001 Certified' },
      // { icon: Heart, text: 'Trusted by 500+ Centers' }
    ],
    copyright: '© 2024 MedQueue Pro. All rights reserved.',
    madeWith: 'Made with',
    bottomLinks: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
  };

  getSections() {
    return Object.values(this.content.sections);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
