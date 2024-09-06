import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-project.component.html',
  styleUrl: './card-project.component.css'
})
export class CardProjectComponent {
  @Input() name: any;
  @Input() description: any;
  @Input() image: any;
  @Input() tecnologies: any;
  @Input() link: any;
  showMore = false;
  toggleDescription() {
    this.showMore = !this.showMore;
  }

  // Función para abrir el lightbox
  openLightbox(event: MouseEvent): void {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;

    lightboxImg.src = (event.target as HTMLImageElement).src;

    if (lightbox) {
      lightbox.style.display = 'block';
    }
  }

  // Función para cerrar el lightbox
  closeLightbox(): void {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.style.display = 'none';
    }
  }
}
