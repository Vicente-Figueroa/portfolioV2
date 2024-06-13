import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ResumeComponent } from './features/resume/resume.component';

export const routes: Routes = [

    { path: 'resume', component: ResumeComponent },
    { path: '**', component: HomeComponent },
];
