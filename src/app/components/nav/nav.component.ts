import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  // Función para eliminar el token de onboarding
  resetOnboarding() {
    localStorage.removeItem('hasSeenOnboarding');
    alert('El onboarding se ha reseteado. Recarga la página para verlo nuevamente.');
    window.location.reload(); // Recargar la página automáticamente

  }

}
