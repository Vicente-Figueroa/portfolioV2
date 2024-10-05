import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  conversation: string[] = [];
  private apiUrl = 'https://botnotion.vercel.app/chat';

  constructor(private http: HttpClient) { }

  enviarMensaje() {
    if (this.mensajeUsuario.trim() === '') {
      return;
    }

    this.conversation.push('Usuario: ' + this.mensajeUsuario);
    const mensajeEnviado = this.mensajeUsuario;
    this.mensajeUsuario = '';
    this.cargando = true;

    this.http.post<any>(this.apiUrl, { mensaje: mensajeEnviado }).subscribe({
      next: (response) => {
        this.respuestaBot = response.respuesta;
        this.conversation.push('Chatbot: ' + this.respuestaBot);
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