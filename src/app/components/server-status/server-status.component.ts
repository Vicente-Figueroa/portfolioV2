import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div [ngClass]="{
    'status-green': status === 'online',
    'status-yellow': status === 'slow',
    'status-red': status === 'offline'
  }" class="status-indicator"></div>
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
export class ServerStatusComponent {
  private apiUrl = environment.apiUrl; // Accede a la URL del backend desde el entorno

  public status: 'online' | 'slow' | 'offline' = 'offline';  // Estado del servidor

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.checkServerStatus();  // Verificar el estado del servidor al iniciar
  }

  checkServerStatus() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Hacer una solicitud "ping" al servidor
    this.http.get(`${this.apiUrl}/api/ping/`, { headers, observe: 'response' })
      .subscribe(
        response => {
          if (response.status === 200) {
            this.status = 'online';  // Servidor disponible
          } else {
            this.status = 'slow';  // Respuesta lenta o diferente
          }
        },
        error => {
          this.status = 'offline';  // Error de conexión
        }
      );
  }
}
