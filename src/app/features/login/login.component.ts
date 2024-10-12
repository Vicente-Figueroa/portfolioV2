import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa el Router
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule],

})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };
  loginError = false;
  errorMessage = '';
  showSuccessMessage = false;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {} // Inyecta el Router

  submitLogin() {
    if (!this.loginData.username.trim() || !this.loginData.password.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const loginPayload = {
      username: this.loginData.username,
      password: this.loginData.password
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://localhost:5000/auth/login', loginPayload, { headers: headers })
      .subscribe(
        (response: any) => {
          console.log('Login exitoso', response);

          // Guardar el token en localStorage
          this.authService.setToken(response.token);

          this.showSuccessMessage = true;
          this.loginError = false;

          // Redirigir al usuario al inicio
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error en el login', error);
          this.loginError = true;
          this.errorMessage = 'Email o contraseña incorrectos';
        }
      );
  }
}
