import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardProjectComponent } from './card-project/card-project.component';
import { Project } from '../../models/project';
import gsap from 'gsap'; 
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardProjectComponent, CommonModule, HttpClientModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  data!: Project[];
  constructor(private http: HttpClient) { }
  ngOnInit() {
    // Animation
    const tl = gsap.timeline();
    tl.fromTo('.tittle', 
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".projects", // El trigger ahora es la propia sección ".projects"
          start: "top 80%", 
          toggleActions: "play none none reverse" 
        }
      }
    );
    tl.fromTo('.project', 
      { opacity: 0, y: '-5%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".projects", // El trigger ahora es la propia sección ".projects"
          start: "top 40%", 
          toggleActions: "play none none reverse" 
        }
      }, '>-2'
    );

    // Suscribe
    this.http.get<Project[]>('data/projects.json')
      .subscribe(
        (data) => {
          console.log('Datos cargados:', data);
          this.data = data;
        },
        (error) => {
          console.error('Error al cargar los datos:', error);
        }
      );
  }
}
