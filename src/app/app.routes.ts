import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProviderLayoutComponent } from './components/provider-layout/provider-layout.component';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [{ path: '' }, { path: '' }, { path: '' }],
  },
  {
    path: 'provider',
    component: ProviderLayoutComponent,
    children: [{ path: '' }, { path: '' }, { path: '' }],
  },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: '**', component: NotFoundComponent, title: 'Not Found' },
];
