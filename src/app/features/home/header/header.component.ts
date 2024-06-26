import { Component } from '@angular/core';
import { DotsComponent } from './dots/dots.component';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Registrar el plugin ScrollTrigger con GSAP
gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DotsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  ngOnInit() {
    const tl = gsap.timeline();
    tl.fromTo('.banner',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 2,
        scrollTrigger: {
          trigger: ".banner", // El elemento que activa la animación
          start: "top 80%", // Iniciar cuando el elemento esté al 80% de la ventana
          toggleActions: "play none none reverse" // Reproducir al bajar, invertir al subir
        }
      }
    ); 
    tl.fromTo('.photo',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 3,
        scrollTrigger: {
          trigger: ".photo", // El elemento que activa la animación
          start: "top 80%", // Iniciar cuando el elemento esté al 80% de la ventana
          toggleActions: "play none none reverse" // Reproducir al bajar, invertir al subir
        }
      }, '>-1'
    );


  }


}
