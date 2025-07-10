import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LucideAngularModule, Menu, X, Stethoscope, Globe, ChevronDown } from 'lucide-angular';



@Component({
  selector: 'app-header',
  imports:[CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css',

  ]
})
export class HeaderComponent  {

    menuIcon = Menu;
  xIcon = X;
  stethoscopeIcon = Stethoscope;
  globeIcon = Globe;
  chevronDownIcon = ChevronDown;

  content = {
    brand: 'MedQueue Pro',
    nav: ['Features', 'How It Works', 'Pricing', 'Contact'],
    cta: 'Get Started',
    login: 'Login',
    demo: 'Request Demo'
  };

}





