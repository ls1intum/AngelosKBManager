import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { SampleQuestionsComponent } from './components/sample-questions/sample-questions.component';
import { WebsitesComponent } from './components/websites/websites.component';

export const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'documents', component: DocumentsComponent },
    { path: 'sample-questions', component: SampleQuestionsComponent },
    { path: 'websites', component: WebsitesComponent },
    { path: '', redirectTo: 'websites', pathMatch: 'full' },
];
