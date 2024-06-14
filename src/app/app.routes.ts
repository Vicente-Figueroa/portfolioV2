import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ResumeComponent } from './features/resume/resume.component';
import { ProjectsComponent } from './features/projects/projects.component';

export const routes: Routes = [

    { path: 'resume', component: ResumeComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: '**', component: HomeComponent },
];
