import { Component, OnInit } from '@angular/core';
import { ServerStatusComponent } from '../server-status/server-status.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../features/login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ServerStatusComponent, CommonModule, FormsModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) { }
  ngOnInit() {
  }

  resetOnboarding() {
    localStorage.removeItem('hasSeenOnboarding');
    alert('¡Se recargará la página!');
    window.location.reload();
  }
  logout() {
    this.authService.clearToken();  // Limpia el token del almacenamiento local
    this.router.navigate(['/login']);  // Redirige al usuario a la página de login
  }
}