import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { SampleQuestionsComponent } from './components/sample-questions/sample-questions.component';
import { WebsitesComponent } from './components/websites/websites.component';
import { LoginComponent } from './components/login/login.component'; // Ensure correct path
import { AuthGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { ConfirmMailComponent } from './components/confirm-mail/confirm-mail.component';
import { GuardComponent } from './components/guard/guard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'confirm',
    component: ConfirmMailComponent
  },
  {
    path: 'session-expired',
    component: GuardComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sample-questions',
    component: SampleQuestionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'websites',
    component: WebsitesComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'websites', pathMatch: 'full' }
];