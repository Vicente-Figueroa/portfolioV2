import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { environment } from '../../../../environments/environment';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  message!: string;
  email!: string;
  question!: string; // Almacena la pregunta del usuario
  conversation: string[] = []; // Almacena la conversación
  loading = true;
  messageCount = 0; // Cuenta los mensajes enviados
  showPopup = false; // Controla la visibilidad del popup
  @Output() closeChatEvent = new EventEmitter<void>();

  private apiUrl = environment.apiUrl; // Accede a la URL del backend desde el entorno

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Animation
    gsap.fromTo(
      '.chat',
      { opacity: 0 }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: '.projects', // El trigger es la propia sección ".projects"
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    this.getInitialMessage(); // Llamamos a la función para obtener el mensaje inicial
  }

  getInitialMessage() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .get(`${this.apiUrl}/api/chat/`, { headers: headers }) // Usamos la URL del entorno
      .subscribe((response: any) => {
        this.message = response.message.replace(/```/g, '').replace(/\n/g, '');
        this.conversation.push(this.message); // Agregamos el mensaje inicial a la conversación
        console.log(this.message);
        this.loading = false;
      });
  }

  askQuestion() {
    if (!this.question?.trim()) {
      return; // No hacer nada si la pregunta está vacía o es solo espacios en blanco
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = { question: this.question.trim() }; // Eliminamos espacios en blanco innecesarios

    this.http.post(`${this.apiUrl}/api/chat/`, body, { headers: headers }) // Usamos la URL del entorno
      .subscribe({
        next: (response: any) => {
          const formattedMessage = this.formatResponse(response.message);
          this.updateConversation(this.question, formattedMessage);
          this.resetQuestion();
        },
        error: (error) => {
          console.error('Error al enviar la pregunta:', error);
          // Aquí podrías agregar lógica para notificar al usuario sobre el error
        }
      });
  }

  // Formatea la respuesta del backend, eliminando caracteres no deseados
  private formatResponse(message: string): string {
    return message.replace(/```/g, '').replace(/\n/g, '').replace('**', '');
  }

  // Actualiza la conversación con la nueva pregunta y respuesta
  private updateConversation(question: string, response: string): void {
    this.conversation.push(`Tu: ${question}`);
    this.conversation.push(response);
    this.messageCount++;

    this.showPopup = this.messageCount >= 2; // Mostrar el popup después de 2 mensajes
  }

  // Resetea la pregunta del usuario
  private resetQuestion(): void {
    this.question = '';
  }

  closePopup() {
    if (this.email) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const body = { email: this.email };

      this.http
        .post(`${this.apiUrl}/api/send-email`, body, { headers: headers }) // Usamos la URL del entorno
        .subscribe(
          (response: any) => {
            console.log('Correo enviado:', response);
            this.email = ''; // Limpiar el campo de correo después de enviarlo
            this.showPopup = false; // Cerrar el popup después de enviar el correo
          },
          (error) => {
            console.error('Error al enviar el correo:', error);
            // Manejar el error de acuerdo a tus necesidades
          }
        );
    }
  }

  closeChat() {
    this.closeChatEvent.emit(); // Emitimos el evento para cerrar el chat
  }
}