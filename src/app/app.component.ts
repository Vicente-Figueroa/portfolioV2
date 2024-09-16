import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ChatButtonComponent } from './components/chat-button/chat-button.component';
import { OnboardingComponent } from './features/onboarding/onboarding.component';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, ChatButtonComponent, OnboardingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Vicente';
  private apiUrl: string = environment.apiUrl + "/api/ping/"
  public serverStatus: string = 'offline'; // Estado inicial del servidor

  constructor(private http: HttpClient) { }


  ngOnInit(): void {
    // Eliminar el local item server-status
    localStorage.removeItem('serverStatus');
    // Hacer ping al servidor cuando la aplicación se cargue
    this.checkServerStatus();
  }
  // Método para hacer ping al servidor
  checkServerStatus() {
    this.http.get(this.apiUrl, { responseType: 'text' }) // Hacemos una solicitud GET al servidor
      .pipe(
        catchError(() => {
          // Si hay un error, asumimos que el servidor está offline
          this.serverStatus = 'offline';
          localStorage.setItem('serverStatus', 'offline'); // Guardar el estado en localStorage
          console.log('El servidor está offline.');
          return [];
        })
      )
      .subscribe(() => {
        // Si la solicitud es exitosa, el servidor está online
        this.serverStatus = 'online';
        localStorage.setItem('serverStatus', 'online'); // Guardar el estado en localStorage
        console.log('El servidor está online.');
      });
  }
}
