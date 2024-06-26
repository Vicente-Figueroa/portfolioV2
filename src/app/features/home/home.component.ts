import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import gsap from 'gsap'; 
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ngOnInit() {
    gsap.fromTo('.aboutme', 
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".aboutme", // El trigger ahora es la propia sección ".aboutme"
          start: "top 80%", 
          toggleActions: "play none none reverse" 
        }
      }
    );
  }
}
