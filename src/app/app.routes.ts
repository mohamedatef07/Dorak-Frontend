import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProviderManagementComponent } from './features/owner/components/provider-management/provider-management.component';
import { AddProviderComponent } from './features/owner/components/add-provider/add-provider.component';
import { SearchProviderComponent } from './features/owner/components/search-provider/search-provider.component';
import { ProviderProfilesComponent } from './features/owner/components/provider-profile/provider-profile.component';
import { CenterProviderProfileComponent } from './features/owner/components/center-provider-profile/center-provider-profile.component';
import { ManuallyScheduleComponent } from './features/owner/components/manually-schedule/manually-schedule.component';
import { WeeklyScheduleComponent } from './features/owner/components/weekly-schedule/weekly-schedule.component';
import { ProviderLiveQueueComponent } from './features/owner/components/provider-live-queue/provider-live-queue.component';
import { ProviderScheduleComponent } from './features/owner/components/provider-schedule/provider-schedule.component';
import { ProviderLayoutComponent } from './features/provider/components/provider-layout/provider-layout.component';
import { OwnerLayoutComponent } from './features/owner/components/owner-layout/owner-layout.component';
import { ClientLayoutComponent } from './features/client/components/client-layout/client-layout.component';
import { DoctorDetailsComponent } from './features/client/components/doctor-details/doctor-details.component';
import { ClientProfileComponent } from './features/client/components/client-profile/client-profile.component';
import { ScheduleComponent } from './features/provider/components/schedule/schedule.component';
import { PatientQueueComponent } from './features/provider/components/patient-queue/patient-queue.component';
import { ReportsComponent } from './features/provider/components/reports/reports.component';
import { DashboardComponent } from './features/provider/components/dashboard/dashboard.component';
import { ReviewComponent } from './features/landingpage/components/review/review.component';
import { DoctorsPageComponent } from './features/client/components/doctorsPage/doctorsPage.component';
import { ProviderProfileComponent } from './features/provider/components/provider-profile/provider-profile.component';
import { ManageOperatorsComponent } from './features/owner/components/ManageOperators/ManageOperators.component';
import { AddOperatorComponent } from './features/owner/components/AddOperator/AddOperator.component';
import { CreateAppointmentComponent } from './features/owner/components/CreateAppointment/CreateAppointment.component';
import { EditProfileComponent } from './features/client/components/edit-profile/edit-profile.component';
import { UpcomingAppointmentsComponent } from './features/client/components/upcoming-appointments/upcoming-appointments.component';
import { ClientLiveQueueComponent } from './features/client/components/Client-Live-Queue/Client-Live-Queue.component';
import { ClientWalletComponent } from './features/client/components/ClientWallet/ClientWallet.component';
import { ProviderSidebarComponent } from './features/provider/components/provider-sidebar/provider-sidebar.component';
import { PersonalSettingComponent } from './features/provider/components/personalSetting/personalSetting.component';
import { ProfessionalInformationComponent } from './features/provider/components/ProfessionalInformation/ProfessionalInformation.component';
import { SecurityProfileComponent } from './features/provider/components/SecurityProfile/SecurityProfile.component';
import { ProviderSettingComponent } from './features/provider/components/Provider-Setting/Provider-Setting.component';
import { LandingPageLayoutComponent } from './features/landingpage/components/landingPage-layout/landingPage-layout.component';
import { CheckoutComponent } from './features/client/components/checkout/checkout.component';
import { CenterShiftsComponent } from './features/owner/components/center-shifts/center-shifts.component';
import { ChangePasswordComponent } from './features/client/components/Change-Password/Change-Password.component';
import { CenterShiftsTableComponent } from './features/owner/components/center-shifts-table/center-shifts-table.component';
import { appointmentDetails } from './features/client/components/appointment-details/appointment-details';
import { ClientUpdateComponent } from './features/client/components/client-update/client-update.component';
import { SystemPreferencesSettingsComponent } from './features/provider/components/system-preferences-settings/system-preferences-settings.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

export const routes: Routes = [
  {
    path: 'owner',
    component: OwnerLayoutComponent,
    children: [
      {
        path: 'center-shifts',
        component: CenterShiftsComponent,
        title: 'Center Shifts',
      },
      {
        path: 'manage-operators',
        component: ManageOperatorsComponent,
        title: 'Manage Operators',
      },
      {
        path: 'add-operator',
        component: AddOperatorComponent,
        title: 'Add Operator',
      },
      {
        path: 'create-appointment',
        component: CreateAppointmentComponent,
        title: 'Create Appointment',
      },
      {
        path: 'provider-management',
        component: ProviderManagementComponent,
        title: 'Provider Management',
      },
      {
        path: 'add-provider',
        component: AddProviderComponent,
        title: 'Add Provider',
      },
      {
        path: 'search-provider',
        component: SearchProviderComponent,
        title: 'Search Provider',
      },
      {
        path: 'center-provider-profile/:id',
        component: CenterProviderProfileComponent,
        title: 'Center Provider Profile',
      },
      {
        path: 'provider-profile/:id',
        component: ProviderProfilesComponent,
        title: 'Provider Profile',
      },
      {
        path: 'manually-schedule/:id',
        component: ManuallyScheduleComponent,
        title: 'Manually Schedule',
      },
      {
        path: 'weekly-schedule/:id',
        component: WeeklyScheduleComponent,
        title: 'Weekly Schedule',
      },
      {
        path: 'provider-schedule',
        component: ProviderScheduleComponent,
        title: 'Provider Schedule',
      },
      {
        path: 'center-shifts-table',
        component: CenterShiftsTableComponent,
        title: 'Center Shifts Table',
      },

      {
        path: 'provider-live-queue/:shiftId',
        component: ProviderLiveQueueComponent,
        title: 'Provider Live Queue',
      },
      {
        path: 'manage-operators',
        component: ManageOperatorsComponent,
        title: 'Manage Operators',
      },
      {
        path: 'add-operator',
        component: AddOperatorComponent,
        title: 'Add Operator',
      },
      {
        path: 'create-appointment',
        component: CreateAppointmentComponent,
        title: 'Create Appointment',
      },
    ],
  },
  {
    path: 'provider',
    component: ProviderLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      {
        path: 'profile',
        component: ProviderProfileComponent,
        title: 'Profile',
      },
      {
        path: 'patient-queue',
        component: PatientQueueComponent,
        title: 'Patient Queue',
      },
      { path: 'schedule', component: ScheduleComponent, title: 'Schedule' },
      { path: 'reports', component: ReportsComponent, title: 'Reports' },
      {
        path: 'settings',
        component: ProviderSettingComponent,
        children: [
          { path: '', redirectTo: 'personal-settings', pathMatch: 'full' },
          {
            path: 'personal-settings',
            component: PersonalSettingComponent,
            title: 'Personal Settings',
          },
          {
            path: 'professional-settings',
            component: ProfessionalInformationComponent,
            title: 'Professional Settings',
          },
          {
            path: 'security-settings',
            component: SecurityProfileComponent,
            title: 'Security Settings',
          },
          {
            path: 'system-preferences-settings',
            component: SystemPreferencesSettingsComponent,
            title: 'System Preferences Settings',
          },
        ],
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
        title: 'Notifications',
      },
    ],
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'client-profile',
        pathMatch: 'full',
      },
      {
        path: 'doctor-details/:id',
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
        component: ClientUpdateComponent,
        title: 'Edit Client Profile',
      },
      {
        path: 'client-upcoming-appointments',
        component: UpcomingAppointmentsComponent,
        title: 'Client Upcoming Appointments',
      },
      {
        path: 'appointment/:appointmentId',
        loadComponent: () =>
          import(
            './features/client/components/appointment-details/appointment-details'
          ).then((m) => m.appointmentDetails),
      },
      {
        path: 'client-live-queue/:appointmentId',
        component: ClientLiveQueueComponent,
        title: 'Live Queue Appointment',
      },
      {
        path: 'client-wallet',
        component: ClientWalletComponent,
        title: 'Client Wallet',
      },
      {
        path: 'doctor',
        component: DoctorsPageComponent,
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
    ],
  },

  // ----------------------------------

  // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'Client' }

  // ----------------------------------

  {
    path: 'home',
    component: LandingPageLayoutComponent,
    children: [
      // { path: 'doctors', component: DoctorsLandingPageComponent },
      { path: 'review', component: ReviewComponent },
      // { path: 'certification', component: CertificationsComponent },
      // { path: 'register', component: LandingPageRegisterComponent },
    ],
    title: 'Home',
  },
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
