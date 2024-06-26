import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { Resume } from '../../models/resume';
import { ProjectsComponent } from '../projects/projects.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CardsComponent, CommonModule, HttpClientModule, ProjectsComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent implements OnInit {
  data!: Resume;

  constructor(private http: HttpClient) { }


  ngOnInit() {
    // Animation
    gsap.fromTo('.experience-tittle',
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".experience-tittle", // El trigger ahora es la propia sección ".experience"
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation
    gsap.fromTo('.experience-card',
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".experience-card", // El trigger ahora es la propia sección ".experience"
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    // Animation
    gsap.fromTo('.education-tittle',
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".education-tittle", // El trigger ahora es la propia sección ".experience"
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    // Animation
    gsap.fromTo('.skills',
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".skills", // El trigger ahora es la propia sección ".experience"
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    // Suscribe
    this.http.get<Resume>('data/resume.json')
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
