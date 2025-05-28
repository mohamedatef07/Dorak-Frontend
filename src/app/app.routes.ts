import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProviderLayoutComponent } from './features/provider/components/provider-layout/provider-layout.component';
import { OwnerLayoutComponent } from './features/owner/components/owner-layout/owner-layout.component';
import { ClientLayoutComponent } from './features/client/components/client-layout/client-layout.component';
import { DoctorsPageComponent } from './features/client/components/doctorsPage/doctorsPage.component';
import { LandingpageLayoutComponent } from './features/landingpage/landingpage-layout/landingpage-layout/landingpage-layout.component';
import { HeroComponent } from './features/landingpage/components/hero/hero.component';
import { DoctorsComponent } from './features/landingpage/components/doctors/doctors.component';
import { ReviewComponent } from './features/landingpage/components/review/review.component';
import { CertificationsComponent } from './features/landingpage/components/Certifications/Certifications.component';

export const routes: Routes = [
  // {
  //   path: 'owner',
  //   component: OwnerLayoutComponent,
  //   children: [{ path: '' }, { path: '' }, { path: '' }],
  // },
  // {
  //   path: 'provider',
  //   component: ProviderLayoutComponent,
  //   children: [{ path: '' }, { path: '' }, { path: '' }],
  // },

  {
    path: 'home',
    component: LandingpageLayoutComponent,
    children: [
     

      { path: 'doctors',
        component:DoctorsComponent
      },
       { path: 'review',
        component:ReviewComponent
       },
       { path: 'certfication',
        component:CertificationsComponent
       },



      ]
      ,
   },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [
  {
    path: 'doctorsPage',
    component: DoctorsPageComponent,
  }
]
  },




  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
