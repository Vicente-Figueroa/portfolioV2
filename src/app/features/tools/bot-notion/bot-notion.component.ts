import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-bot-notion',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bot-notion.component.html',
  styleUrl: './bot-notion.component.css'
})
export class BotNotionComponent {
  mensajeUsuario: string = '';
  respuestaBot: string = '';
  cargando: boolean = false;
  conversation: string[] = []; // Array para almacenar la conversación
  private apiUrl = 'https://botnotion-cnlz323f4-vicente-figueroas-projects.vercel.app/chat';

  constructor(private http: HttpClient) { } // Inyecta HttpClient

  enviarMensaje() {
    if (this.mensajeUsuario.trim() === '') {
      return; // No enviar mensajes vacíos
    }

    this.conversation.push('Usuario: ' + this.mensajeUsuario); // Agregar mensaje del usuario a la conversación
    this.mensajeUsuario = ''; // Limpiar el input del usuario
    this.cargando = true;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
    });
    this.http.post<any>(this.apiUrl, { mensaje: this.mensajeUsuario }, { headers: headers }).subscribe({
      next: (response) => {
        this.respuestaBot = response.respuesta;
        this.conversation.push('Chatbot: ' + this.respuestaBot); // Agregar respuesta del bot a la conversación
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al enviar el mensaje:', error);
        this.conversation.push('Chatbot: Error al comunicarse con el servidor.');
        this.cargando = false;
      }
    });
  }
}