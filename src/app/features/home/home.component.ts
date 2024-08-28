import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ProjectsComponent } from '../projects/projects.component';

gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, ProjectsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ngOnInit() {
  }
}
