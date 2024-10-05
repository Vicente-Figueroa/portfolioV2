import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ResumeComponent } from './features/resume/resume.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { ContactComponent } from './features/contact/contact.component';
import { ChatComponent } from './components/chat-button/chat/chat.component';
import { ChatbotEcommerceComponent } from './features/tools/chatbot-ecommerce/chatbot-ecommerce.component';
import { SocialnetworkPostBotComponent } from './features/tools/socialnetwork-post-bot/socialnetwork-post-bot.component';
import { BotNotionComponent } from './features/tools/bot-notion/bot-notion.component';

export const routes: Routes = [
  { path: 'resume', component: ResumeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'ecommerce', component: ChatbotEcommerceComponent },
  { path: 'socialnetwork-bot', component: SocialnetworkPostBotComponent },
  { path: 'chat-notion', component: BotNotionComponent },
  { path: '**', component: HomeComponent },
];
