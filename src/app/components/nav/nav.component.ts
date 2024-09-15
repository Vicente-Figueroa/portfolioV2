import { Component, OnInit } from '@angular/core';
import { ServerStatusComponent } from '../server-status/server-status.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ServerStatusComponent, CommonModule, FormsModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public debugMode: boolean = false; // Estado del modo debug

  ngOnInit() {
    // Verificar si el modo debug existe en localStorage
    const savedDebugMode = localStorage.getItem('navDebugMode');

    // Si no existe, inicializarlo en false
    if (savedDebugMode === null) {
      localStorage.setItem('navDebugMode', 'false');
      this.debugMode = false;
    } else {
      // Si existe, sincronizar el valor con el estado del componente
      this.debugMode = savedDebugMode === 'true';
    }
  }

  toggleNavDebugMode(newValue: boolean) {
    // Guardar el nuevo estado en localStorage
    localStorage.setItem('navDebugMode', newValue.toString());
  }

  // Función para eliminar el token de onboarding
  resetOnboarding() {
    localStorage.removeItem('hasSeenOnboarding');
    alert('¡Se recargará la página!');
    window.location.reload(); // Recargar la página automáticamente
  }
}