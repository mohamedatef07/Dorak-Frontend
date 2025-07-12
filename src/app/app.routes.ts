import { ProviderNotificationsComponent } from './features/provider/components/provider-notifications/provider-notifications.component';
import { AssignServiceToProviderCenterComponent } from './features/owner/components/assign-service-to-provider-center/assign-service-to-provider-center.component';
import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProviderManagementComponent } from './features/owner/components/provider-management/provider-management.component';
import { AddProviderComponent } from './features/owner/components/add-provider/add-provider.component';
import { SearchProviderComponent } from './features/owner/components/search-provider/search-provider.component';
import { ProviderProfilesComponent } from './features/owner/components/provider-profile/provider-profile.component';
import { CenterProviderProfileComponent } from './features/owner/components/center-provider-profile/center-provider-profile.component';
import { ManuallyScheduleComponent } from './features/owner/components/manually-schedule/manually-schedule.component';
import { WeeklyScheduleComponent } from './features/owner/components/weekly-schedule/weekly-schedule.component';
import { ProviderLiveQueueComponent } from './features/owner/components/provider-live-queue/provider-live-queue.component';
import { ProviderLayoutComponent } from './features/provider/components/provider-layout/provider-layout.component';
import { OwnerLayoutComponent } from './features/owner/components/owner-layout/owner-layout.component';
import { ClientLayoutComponent } from './features/client/components/client-layout/client-layout.component';
import { DoctorDetailsComponent } from './features/client/components/doctor-details/doctor-details.component';
import { ClientProfileComponent } from './features/client/components/client-profile/client-profile.component';
import { ScheduleComponent } from './features/provider/components/schedule/schedule.component';
import { PatientQueueComponent } from './features/provider/components/patient-queue/patient-queue.component';
import { ReportsComponent } from './features/provider/components/reports/reports.component';
import { DashboardComponent } from './features/provider/components/dashboard/dashboard.component';
import { DoctorsPageComponent } from './features/client/components/doctorsPage/doctorsPage.component';
import { ProviderProfileComponent } from './features/provider/components/provider-profile/provider-profile.component';
import { ManageOperatorsComponent } from './features/owner/components/ManageOperators/ManageOperators.component';
import { AddOperatorComponent } from './features/owner/components/AddOperator/AddOperator.component';
import { CreateAppointmentComponent } from './features/owner/components/CreateAppointment/CreateAppointment.component';
import { UpcomingAppointmentsComponent } from './features/client/components/upcoming-appointments/upcoming-appointments.component';
import { ClientLiveQueueComponent } from './features/client/components/Client-Live-Queue/Client-Live-Queue.component';
import { ClientWalletComponent } from './features/client/components/ClientWallet/ClientWallet.component';
import { ProviderSidebarComponent } from './features/provider/components/provider-sidebar/provider-sidebar.component';
import { PersonalSettingComponent } from './features/provider/components/personalSetting/personalSetting.component';
import { ProfessionalInformationComponent } from './features/provider/components/ProfessionalInformation/ProfessionalInformation.component';
import { SecurityProfileComponent } from './features/provider/components/SecurityProfile/SecurityProfile.component';
import { ProviderSettingComponent } from './features/provider/components/Provider-Setting/Provider-Setting.component';
import { CheckoutComponent } from './features/client/components/checkout/checkout.component';
import { CenterShiftsComponent } from './features/owner/components/center-shifts/center-shifts.component';
import { ChangePasswordComponent } from './features/client/components/Change-Password/Change-Password.component';
import { CenterShiftsTableComponent } from './features/owner/components/center-shifts-table/center-shifts-table.component';
import { appointmentDetails } from './features/client/components/appointment-details/appointment-details';
import { ClientUpdateComponent } from './features/client/components/client-update/client-update.component';
import { SystemPreferencesSettingsComponent } from './features/provider/components/system-preferences-settings/system-preferences-settings.component';
import { ClientSettingsComponent } from './features/client/components/client-settings/client-settings.component';
import { ClientNotificationsComponent } from './features/client/components/client-notifications/client-notifications.component';
import { RescheduleAssignmentComponent } from './features/owner/components/reschedule-assignment/reschedule-assignment.component';
import { AppointmentsHistoryComponent } from './features/client/components/appointments-history/appointments-history.component';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { HeroComponent } from './features/landingpage/components/hero/hero.component';
import { CenterRegisterComponent } from './components/CenterRegister/CenterRegister.component';
import { ContactUsComponent } from './components/Contact-Us/Contact-Us.component';
import { HelpSupportComponent } from './components/Help-Support/Help-Support.component';
import { TermsConditionsComponent } from './components/Terms-Conditions/Terms-Conditions.component';
import { ClientReviewsComponent } from './features/client/components/client-reviews/client-reviews.component';
import { CenterRegisterCodeComponent } from './components/CenterRegisterCode/CenterRegisterCode.component';
import { CenterRegisterCodeGuard } from './guards/center-register-code.guard';
import { ProviderCenterServiceComponent } from './features/owner/components/ProviderCenterService/ProviderCenterService.component';
import { AddReviewComponent } from './features/client/components/add-review/add-review.component';
import { ProviderReviewsComponent } from './features/provider/components/provider-reviews/provider-reviews.component';

export const routes: Routes = [
  {
    path: 'owner',
    component: OwnerLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['Admin', 'Operator'] },
    children: [
      {
        path: 'center-shifts',
        component: CenterShiftsComponent,
        title: 'Center Shifts',
      },
      {
        path: 'assign-service-to-provider-center',
        component: AssignServiceToProviderCenterComponent,
        title: 'Assign Service To Provider Center',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'manage-operators',
        component: ManageOperatorsComponent,
        title: 'Manage Operators',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'add-operator',
        component: AddOperatorComponent,
        title: 'Add Operator',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'create-appointment',
        component: CreateAppointmentComponent,
        title: 'Create Appointment',
        data: { expectedRole: ['Admin'] },
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
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'search-provider',
        component: SearchProviderComponent,
        title: 'Search Provider',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'center-provider-profile/:id',
        component: CenterProviderProfileComponent,
        title: 'Center Provider Profile',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'provider-profile/:id',
        component: ProviderProfilesComponent,
        title: 'Provider Profile',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'manually-schedule/:id',
        component: ManuallyScheduleComponent,
        title: 'Manually Schedule',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'weekly-schedule/:id',
        component: WeeklyScheduleComponent,
        title: 'Weekly Schedule',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'reschedule-assignment/:id',
        component: RescheduleAssignmentComponent,
        title: 'Reschedule Assignment',
        data: { expectedRole: ['Admin'] },
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
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'add-operator',
        component: AddOperatorComponent,
        title: 'Add Operator',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'create-appointment',
        component: CreateAppointmentComponent,
        title: 'Create Appointment',
        data: { expectedRole: ['Admin'] },
      },
      {
        path: 'provider-center-services',
        component: ProviderCenterServiceComponent,
        title: 'Provider Center Services',
        data: { expectedRole: ['Admin', 'Operator'] },
      },
    ],
  },
  {
    path: 'provider',
    component: ProviderLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['Provider'] },
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
        path: 'reviews',
        component: ProviderReviewsComponent,
        title: 'Reviews',
      },
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
          // {
          //   path: 'system-preferences-settings',
          //   component: SystemPreferencesSettingsComponent,
          //   title: 'System Preferences Settings',
          // },
        ],
      },
      {
        path: 'notifications',
        component: ProviderNotificationsComponent,
        title: 'Notifications',
      },
    ],
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['Client'] },
    children: [
      {
        path: '',
        redirectTo: 'client-profile',
        pathMatch: 'full',
      },
      {
        path: 'client-profile',
        component: ClientProfileComponent,
        title: 'Profile',
      },

      {
        path: 'client-upcoming-appointments',
        component: UpcomingAppointmentsComponent,
        title: 'Upcoming Appointments',
      },
      {
        path: 'appointments-history',
        component: AppointmentsHistoryComponent,
        title: 'Appointments History',
      },
      {
        path: 'appointment/:appointmentId',
        loadComponent: () =>
          import(
            './features/client/components/appointment-details/appointment-details'
          ).then((m) => m.appointmentDetails),
      },
      {
        path: 'client-live-queue/:appointmentId/:shiftId',
        component: ClientLiveQueueComponent,
        title: 'Live Queue Appointment',
      },
      {
        path: 'client-wallet',
        component: ClientWalletComponent,
        title: 'Client Wallet',
      },
      {
        path: 'all-reviews',
        component: ClientReviewsComponent,
        title: 'All Reviews',
      },
      {
        path: 'settings',
        component: ClientSettingsComponent,
        children: [
          { path: '', redirectTo: 'client-edit-profile', pathMatch: 'full' },
          {
            path: 'client-edit-profile',
            component: ClientUpdateComponent,
            title: 'Edit Client Profile',
          },
          {
            path: 'change-password',
            component: ChangePasswordComponent,
            title: 'Change Password',
          },
        ],
      },
      {
        path: 'notifications',
        component: ClientNotificationsComponent,
        title: 'Notifications',
      },
      {
        path: 'add-review/:providerId',
        component: AddReviewComponent,
        title: 'Add Review',
      },
    ],
  },
  {
    path: 'client/doctors',
    component: DoctorsPageComponent,
    title: 'Doctors',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['Client'] },
  },
  {
    path: 'client/doctor-details/:id',
    component: DoctorDetailsComponent,
    title: 'Doctor Details',
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['Client'] },
  },
  {
    path: 'client/checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: ['Client'] },
  },
  // ----------------------------------

  // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'Client' }

  // ----------------------------------

  {
    path: 'home',
    component: HeroComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
    data: { animation: 'login' },
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
    data: { animation: 'register' },
  },
  { path: 'center-code', component: CenterRegisterCodeComponent },
  {
    path: 'center-register',
    component: CenterRegisterComponent,
    canActivate: [CenterRegisterCodeGuard],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    title: 'Unauthorized',
  },
  { path: 'contact-us', component: ContactUsComponent, title: 'Contact Us' },
  {
    path: 'Help-Support',
    component: HelpSupportComponent,
    title: 'Help | Support',
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
    title: 'Terms & Conditions',
  },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
