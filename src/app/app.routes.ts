import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { ProviderLayoutComponent } from './features/provider/components/provider-layout/provider-layout.component';
import { OwnerLayoutComponent } from './features/owner/components/owner-layout/owner-layout.component';
import { ClientLayoutComponent } from './features/client/components/client-layout/client-layout.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { DoctorDetailsComponent } from './features/client/components/doctor-details/doctor-details.component';
import { ClientProfileComponent } from './components/client-profile/client-profile.component';

export const routes: Routes = [
  {
    //   path: 'owner',
    //   component: OwnerLayoutComponent,
    //   children: [{ path: '' }, { path: '' }, { path: '' }],
    // },
    // {
    //   path: 'provider',
    //   component: ProviderLayoutComponent,
    //   children: [{ path: '' }, { path: '' }, { path: '' }],
    // },
    // {
    path: 'client',
    component: ClientLayoutComponent,
    children: [
      {
        path: 'doctor-details',
        component: DoctorDetailsComponent,
        title: 'Doctor Details',
      },
      {
        path: 'client-profile',
        component: ClientProfileComponent,
        title: 'Client-Profile',
      },
    ],
  },

  // ----------------------------------

  // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'Client' }

  // ----------------------------------

  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  {
    path: 'client-register',
    component: ClientRegisterComponent,
    title: 'Client Register',
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'Unauthorized',
  },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
];
