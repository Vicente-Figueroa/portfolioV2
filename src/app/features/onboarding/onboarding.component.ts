import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.css'
})
export class OnboardingComponent implements OnInit {
  showOnboarding = false;

  ngOnInit(): void {
    // Check if the onboarding has been shown before
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    if (!hasSeenOnboarding) {
      // Retraso de 3 segundos antes de mostrar el onboarding
      setTimeout(() => {
        this.showOnboarding = true;
      }, 2500); // 3000 milisegundos = 3 segundos
    }
  }

  closeOnboarding(): void {
    this.showOnboarding = false;

    // Set a flag in localStorage to prevent showing onboarding again
    localStorage.setItem('hasSeenOnboarding', 'true');
  }
}
