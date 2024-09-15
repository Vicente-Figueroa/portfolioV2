import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [CommonModule],
  template: `
<div>
  <span>server-status: </span>
  <span [ngClass]="{'online': serverStatus === 'online', 'offline': serverStatus === 'offline'}">
    {{ serverStatus }}
  </span>
</div>
`,
  styles: [`
  .status-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: grey;
  }
  .status-green {
    background-color: green;
  }
  .status-yellow {
    background-color: yellow;
  }
  .status-red {
    background-color: red;
  }
`]
})
export class ServerStatusComponent implements OnInit, OnDestroy {
  public serverStatus: string = 'asking...'; // Estado inicial del servidor
  private pingInterval: Subscription | undefined; // Para almacenar la suscripción al intervalo
  private apiUrl: string = environment.apiUrl + '/api/ping/'; // URL del servidor

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Verificar si ya existe un estado del servidor en localStorage
    const savedServerStatus = localStorage.getItem('serverStatus');
    if (savedServerStatus) {
      this.serverStatus = savedServerStatus; // Cargar el estado desde localStorage
    }

    // Iniciar el ping cada 5 segundos
    this.pingInterval = interval(5000).subscribe(() => {
      this.checkServerStatus();
    });
  }

  // Método para hacer ping al servidor
  checkServerStatus() {
    this.http.get(this.apiUrl, { responseType: 'text' }) // Hacemos una solicitud GET al servidor
      .pipe(
        catchError(() => {
          // Si hay un error, asumimos que el servidor está offline
          this.serverStatus = 'offline';
          localStorage.setItem('serverStatus', 'offline'); // Guardar el estado en localStorage
          return [];
        })
      )
      .subscribe(() => {
        // Si la solicitud es exitosa, el servidor está online
        this.serverStatus = 'online';
        localStorage.setItem('serverStatus', 'online'); // Guardar el estado en localStorage
      });
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando el componente se destruya
    if (this.pingInterval) {
      this.pingInterval.unsubscribe();
    }
  }
}