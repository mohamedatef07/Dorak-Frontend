import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProviderLayoutComponent } from './features/provider/components/provider-layout/provider-layout.component';
import { OwnerLayoutComponent } from './features/owner/components/owner-layout/owner-layout.component';
import { ClientLayoutComponent } from './features/client/components/client-layout/client-layout.component';

export const routes: Routes = [
  {
    path: 'owner',
    component: OwnerLayoutComponent,
    children: [{ path: '' }, { path: '' }, { path: '' }],
  },
  {
    path: 'provider',
    component: ProviderLayoutComponent,
    children: [{ path: '' }, { path: '' }, { path: '' }],
  },
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [{ path: '' }, { path: '' }, { path: '' }],
  },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
