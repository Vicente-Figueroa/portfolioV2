import { Component, Input, input } from '@angular/core';
import { CardsComponent } from './cards/cards.component';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CardsComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent {

}
