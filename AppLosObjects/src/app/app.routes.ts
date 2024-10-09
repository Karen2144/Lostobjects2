import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { HomeComponent } from './shared/components/home/home.component';
import { MensajesComponent } from './shared/components/mensajes/mensajes.component';
import { ProfileComponent } from './shared/components/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: LoginComponent },
  { path: 'messages', component: MensajesComponent },
  { path: 'profile', component: ProfileComponent },
];
