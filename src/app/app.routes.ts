import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClientRegisterComponent } from './components/client-register/client-register.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ProviderManagementComponent } from './components/provider-management/provider-management.component';
import { AddProviderComponent } from './components/add-provider/add-provider.component';
import {SearchProviderComponent} from './components/search-provider/search-provider.component';
import {ProviderProfileComponent} from './components/provider-profile/provider-profile.component';
import { CenterProviderProfileComponent } from './components/center-provider-profile/center-provider-profile.component';
import { ScheduleOptionsComponent } from './components/schedule-options/schedule-options.component'
import { ManuallyScheduleComponent } from './components/manually-schedule/manually-schedule.component';
import { WeeklyScheduleComponent } from './components/weekly-schedule/weekly-schedule.component';
import { ProviderLiveQueueComponent } from './components/provider-live-queue/provider-live-queue.component';

import { DeleteProviderComponent } from './components/delete-provider/delete-provider.component';
import { ProviderScheduleComponent } from './components/provider-schedule/provider-schedule.component';

import { ProviderLayoutComponent } from './features/provider/components/provider-layout/provider-layout.component';
import { OwnerLayoutComponent } from './features/owner/components/owner-layout/owner-layout.component';
import { ClientLayoutComponent } from './features/client/components/client-layout/client-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';


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
  // {
  //   path: 'client',
  //   component: ClientLayoutComponent,
  //   children: [{ path: '' }, { path: '' }, { path: '' }],
  // },


  // ----------------------------------

  // canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'Client' }

  // ----------------------------------

  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'client-register', component: ClientRegisterComponent, title: 'Client Register' },
  { path: 'unauthorized', component: UnauthorizedComponent, title: 'Unauthorized' },
  {path: 'provider-management', component: ProviderManagementComponent, title: 'Provider Management' },
  {path: 'add-provider', component: AddProviderComponent, title: 'Add Provider' },
  {path: 'search-provider', component: SearchProviderComponent, title: 'Search Provider' },
  { path: 'provider-profile/:id', component: ProviderProfileComponent, title: 'Provider Profile' },
  {path: 'center-provider-profile/:id', component: CenterProviderProfileComponent, title: 'Provider Profile' },
  {path: 'schedule-options/:providerId', component: ScheduleOptionsComponent, title: 'Schedule Options' },
  {path: 'manually-schedule/:id', component: ManuallyScheduleComponent, title: 'Manually Schedule' },
  {path: 'weekly-schedule/:id', component: WeeklyScheduleComponent, title: 'Weekly Schedule' },
  {path: 'provider-live-queue/:id', component: ProviderLiveQueueComponent, title: 'Provider Live Queue' },

  {path: 'provider-schedule', component: ProviderScheduleComponent, title: 'Provider Schedule' },
  {path: 'delete-provider', component: DeleteProviderComponent, title: 'Delete Provider' },

  { path: '**', component: NotFoundComponent, title: 'Not Found' },

];
