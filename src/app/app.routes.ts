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
import { ClientProfileComponent } from './features/client/components/client-profile/client-profile.component';
import { ScheduleComponent } from './features/provider/components/schedule/schedule.component';
import { PatientQueueComponent } from './features/provider/components/patient-queue/patient-queue.component';
import { ReportsComponent } from './features/provider/components/reports/reports.component';
import { DashboardComponent } from './features/provider/components/dashboard/dashboard.component';
import { ProviderProfileComponent } from './features/provider/components/provider-profile/provider-profile.component';
import { ProviderSettingsComponent } from './features/provider/components/provider-settings/provider-settings.component';
import { EditProfileComponent } from './features/client/components/edit-profile/edit-profile.component';
import { UpcomingAppointmentsComponent } from './features/client/components/upcoming-appointments/upcoming-appointments.component';
import { LastAppointmentComponent } from './features/client/components/last-appointment/last-appointment.component';

export const routes: Routes = [
  // {
  //   path: 'owner',
  //   component: OwnerLayoutComponent,
  //   children: [{ path: '' }, { path: '' }, { path: '' }],
  // },
  {
    path: 'provider',
    component: ProviderLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      {
        path: 'patient-queue',
        component: PatientQueueComponent,
        title: 'Patient Queue',
      },
      { path: 'schedule', component: ScheduleComponent, title: 'Schedule' },
      { path: 'reports', component: ReportsComponent, title: 'Reports' },
      {
        path: 'profile',
        component: ProviderProfileComponent,
        title: 'Profile',
      },
      {
        path: 'settings',
        component: ProviderSettingsComponent,
        title: 'Settings',
      },
    ],
  },
  {

    path: 'owner',
    component: OwnerLayoutComponent,
    // children: [{ path: '' }, { path: '' }, { path: '' }],
  },
  // {
  //   path: 'provider',
  //   component: ProviderLayoutComponent,
  //   children: [{ path: '' }, { path: '' }, { path: '' }],
  // },
  {

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
        title: 'Client Profile',
      },
       {
        path: 'client-edit-profile',
        component: EditProfileComponent,
        title: 'Edit Client Profile',
      },
       {
        path: 'client-upcoming-appointments',
        component: UpcomingAppointmentsComponent,
        title: 'Client Upcoming Appointments',
      },
       {
        path: 'last-appointment',
        component: LastAppointmentComponent,
        title: 'Last Appointment',
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
];
