import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ResumeComponent } from './features/resume/resume.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ContactComponent } from './features/contact/contact.component';
import { ChatComponent } from './components/chat-button/chat/chat.component';
import { ChatbotEcommerceComponent } from './features/tools/chatbot-ecommerce/chatbot-ecommerce.component';

export const routes: Routes = [
  { path: 'resume', component: ResumeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'ecommerce', component: ChatbotEcommerceComponent },
  { path: '**', component: HomeComponent },
];
