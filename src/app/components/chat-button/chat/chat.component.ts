import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
}) export class ChatComponent implements OnInit {
  message!: string;
  email!: string;
  question!: string; // Almacena la pregunta del usuario
  conversation: string[] = []; // Almacena la conversación
  loading = true;
  messageCount = 0; // Cuenta los mensajes enviados
  showPopup = false; // Controla la visibilidad del popup
  isEmailValid = false; // Controla la validez del correo electrónico
  emailSent = false; // Nueva variable para controlar si ya se envió el correo
  @Output() closeChatEvent = new EventEmitter<void>();

  private apiUrl = environment.apiUrl; // Accede a la URL del backend desde el entorno

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadConversation(); // Cargar cualquier conversación guardada
    this.loadPopupState();   // Cargar el estado del popup y si ya se envió el correo

    if (this.conversation.length === 0) {
      this.getInitialMessage(); // Llamamos a la función para obtener el mensaje inicial solo si no hay conversación previa
    }
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
        this.saveConversation(); // Guardar la conversación en localStorage
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
        }
      });
  }

  private formatResponse(message: string): string {
    return message.replace(/```/g, '').replace(/\n/g, '').replace('**', '');
  }

  private updateConversation(question: string, response: string): void {
    this.conversation.push(`Tu: ${question}`);
    this.conversation.push(response);
    this.messageCount++;

    // Guardar la conversación en localStorage
    this.saveConversation();

    // Mostrar el popup después de 2 mensajes y si el correo no fue enviado
    if (this.messageCount == 2 && !this.emailSent && !this.showPopup) {
      this.showPopup = true;
      this.savePopupState(); // Guardar el estado del popup en localStorage
    }
  }

  private resetQuestion(): void {
    this.question = '';
  }

  private saveConversation(): void {
    localStorage.setItem('chatConversation', JSON.stringify(this.conversation));
    localStorage.setItem('messageCount', this.messageCount.toString());
  }

  private loadConversation(): void {
    const savedConversation = localStorage.getItem('chatConversation');
    const savedMessageCount = localStorage.getItem('messageCount');

    if (savedConversation) {
      this.conversation = JSON.parse(savedConversation);
      this.messageCount = savedMessageCount ? parseInt(savedMessageCount, 10) : 0;
      this.loading = false; // Si se carga una conversación, no es necesario mostrar el mensaje de carga inicial
    }
  }

  // Nueva función para guardar el estado del popup y si el correo fue enviado en el localStorage
  private savePopupState(): void {
    localStorage.setItem('showPopup', JSON.stringify(this.showPopup));
    localStorage.setItem('emailSent', JSON.stringify(this.emailSent)); // Guardar si ya se envió el correo
  }

  // Nueva función para cargar el estado del popup y si el correo ya fue enviado desde el localStorage
  private loadPopupState(): void {
    const savedPopupState = localStorage.getItem('showPopup');
    const emailSentState = localStorage.getItem('emailSent');
    this.showPopup = savedPopupState ? JSON.parse(savedPopupState) : false;
    this.emailSent = emailSentState ? JSON.parse(emailSentState) : false; // Cargar si ya se envió el correo
  }

  clearConversation(): void {
    // Limpiar el localStorage
    localStorage.removeItem('chatConversation');
    localStorage.removeItem('messageCount');

    // Limpiar la conversación en la pantalla
    this.conversation = [];
    this.messageCount = 0;
    this.showPopup = false;
  }

  validateEmail(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailPattern.test(this.email);
  }

  closePopup() {
    if (this.isEmailValid) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const body = { email: this.email };

      this.http
        .post(`${this.apiUrl}/api/send-email/`, body, { headers: headers })
        .subscribe(
          (response: any) => {
            console.log('Correo enviado:', response);
            this.email = ''; // Limpiar el campo de correo después de enviarlo
            this.showPopup = false; // Cerrar el popup después de enviar el correo
            this.emailSent = true; // Marcar que el correo ya fue enviado
            this.savePopupState(); // Guardar el estado del popup y el correo enviado
          },
          (error) => {
            console.error('Error al enviar el correo:', error);
          }
        );
    }
  }

  closeChat() {
    this.closeChatEvent.emit(); // Emitimos el evento para cerrar el chat
  }
}