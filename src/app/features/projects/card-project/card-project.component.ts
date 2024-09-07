import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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

// Función para abrir el lightbox con imagen y descripción dinámicas
openLightbox(imageSrc: string, description: string): void {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img') as HTMLImageElement;
  const lightboxDescription = document.getElementById('lightbox-description') as HTMLParagraphElement;

  if (lightbox && lightboxImg && lightboxDescription) {
    lightboxImg.src = imageSrc;
    lightboxDescription.textContent = description;
    lightbox.style.display = 'block';
  } else {
    console.error('Lightbox elements not found.');
  }
}
  closeLightbox(): void {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
      lightbox.style.display = 'none';
    }
  }
}