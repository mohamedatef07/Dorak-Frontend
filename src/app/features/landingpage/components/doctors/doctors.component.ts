import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Doctor } from '../../../../types/IdoctorsCard';
@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css',
    '..//../../../styles/general.css'
  ]
})
export class DoctorsComponent {
 doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Ahmed Hassan",
    specialty: "Cardiologist",
    image: "https://img.freepik.com/free-photo/medium-shot-male-nurse-posing_23-2150796676.jpg?uid=R199620962&ga=GA1.1.1904957535.1746891474&semt=ais_hybrid&w=740",
    rating: 4.8,
    reviewCount: 124,
    experience: "15 years",
    patients: "2000+",
    shortReview: "Excellent doctor with great bedside manner.",
    bio: "Dr. Ahmed Hassan is a board-certified cardiologist...",
    certifications: [
      { title: "Board Certified in Cardiology", year: "2008" },
      { title: "Fellowship in Interventional Cardiology", year: "2010" },
      { title: "American Heart Association Member", year: "2005" }
    ],
    education: [
      { title: "Cairo University Medical School", year: "2000-2006" },
      { title: "Cardiology Residency, Alexandria University Hospital", year: "2006-2010" },
      { title: "Interventional Cardiology Fellowship, Cleveland Clinic", year: "2010-2012" }
    ],
    reviews: [
      { name: "Mohamed Ali", date: "October 15, 2023", rating: 5, content: "Dr. Hassan is an exceptional cardiologist...", avatar: "img/avatars/avatar-1.jpg" },
      { name: "Laila Mahmoud", date: "September 3, 2023", rating: 4, content: "Very professional and knowledgeable doctor...", avatar: "img/avatars/avatar-2.jpg" },
      { name: "Omar Khaled", date: "August 22, 2023", rating: 5, content: "Dr. Hassan saved my life...", avatar: "img/avatars/avatar-3.jpg" }
    ]
  },
  {
    id: 2,
    name: "Dr. Fatima Nour",
    specialty: "Dermatologist",
    image: "https://i.pinimg.com/736x/45/0c/c7/450cc7cde15d8c90128ea11cb3e3d474.jpg",
    rating: 4.9,
    reviewCount: 98,
    experience: "10 years",
    patients: "1500+",
    shortReview: "Amazing dermatologist who really listens to her patients.",
    bio: "Dr. Fatima Nour is a highly skilled dermatologist...",
    certifications: [
      { title: "Board Certified in Dermatology", year: "2013" },
      { title: "American Academy of Dermatology Member", year: "2013" },
      { title: "Certified in Advanced Laser Treatments", year: "2015" }
    ],
    education: [
      { title: "Ain Shams University Medical School", year: "2005-2011" },
      { title: "Dermatology Residency, Kasr Al Aini Hospital", year: "2011-2014" },
      { title: "Fellowship in Cosmetic Dermatology, Paris", year: "2014-2015" }
    ],
    reviews: [
      { name: "Nadia Ahmed", date: "November 5, 2023", rating: 5, content: "Dr. Fatima is amazing!..." },
      { name: "Karim Essam", date: "October 20, 2023", rating: 5, content: "Excellent dermatologist!..." },
      { name: "Heba Salah", date: "September 12, 2023", rating: 4, content: "Dr. Fatima is very professional..." }
    ]
  },

];

}
