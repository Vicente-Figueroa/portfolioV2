import { Component } from '@angular/core';
import { DotsComponent } from './dots/dots.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DotsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
