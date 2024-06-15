import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  @Input() date: any;
  @Input() job: any;
  @Input() enterprise: any;
  @Input() city: any;
  @Input() description: any;
  @Input() image: any;
  showMore = false;

  toggleDescription() {
    this.showMore = !this.showMore;
  }
}
