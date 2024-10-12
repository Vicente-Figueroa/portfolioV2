import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ResumeComponent } from './features/resume/resume.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ContactComponent } from './features/contact/contact.component';
import { BotNotionComponent } from './features/tools/bot-notion/bot-notion.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './features/login/auth.guard';

export const routes: Routes = [
  { path: 'resume', component: ResumeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'chat-notion', component: BotNotionComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'login', component: LoginComponent },
  { path: '**', component: HomeComponent },
];
