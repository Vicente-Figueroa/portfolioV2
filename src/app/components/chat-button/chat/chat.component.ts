import { Component, OnInit, EventEmitter, Output, Renderer2 } from '@angular/core';
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
})
export class ChatComponent implements OnInit {
  message!: string;
  email!: string;
  question!: string; // Almacena la pregunta del usuario
  conversation: string[] = []; // Almacena la conversación
  loading = true;
  messageCount = 0; // Cuenta los mensajes enviados
  showWhatsAppButton = true; // Mostrar el botón de WhatsApp por defecto
  whatsappLink = 'https://wa.me/56974104013?text=Hola%2C%20me%20gustaría%20obtener%20más%20información%20sobre%20tus%20servicios.';
  isWhatsAppClosed = false; // Controla si el mensaje de WhatsApp ha sido cerrado
  serverStatus!: string
  private storageListener: any; // Para almacenar el listener de localStorage

  @Output() closeChatEvent = new EventEmitter<void>();

  private apiUrl = environment.apiUrl; // Accede a la URL del backend desde el entorno

  constructor(private http: HttpClient, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.loadConversation(); // Cargar cualquier conversación guardada
    this.loadWhatsAppState(); // Cargar el estado del mensaje de WhatsApp

    // Verificar si el bot está iniciado al cargar el componente
    this.serverStatus = localStorage.getItem('serverStatus') || 'online';
    if (this.serverStatus === 'offline') {
      this.disableChat();
    }

    // Escuchar cambios en localStorage para detectar cambios en el estado del bot
    this.storageListener = this.renderer.listen('window', 'storage', (event) => {
      if (event.key === 'botStatus') {
        this.serverStatus = event.newValue;
        if (this.serverStatus === 'offline') {
          this.disableChat();
        } else if (this.serverStatus === 'online') {
          this.enableChat();
        }
      }
    });


    if (this.conversation.length === 0) {
      this.getInitialMessage(); // Llamamos a la función para obtener el mensaje inicial solo si no hay conversación previa
    }
  }


  // Método para deshabilitar el chat cuando el bot no esté iniciado
  disableChat() {
    this.loading = true; // Simular estado de carga
    this.addMessage('Chatbot', 'El bot no está disponible en este momento. Por favor, intenta más tarde.');
  }

  // Método para habilitar el chat cuando el bot esté iniciado
  enableChat() {
    this.loading = false; // Dejar de simular estado de carga
    this.addMessage('Chatbot', 'El bot está disponible. Puedes continuar.');
  }

  // Método para agregar un mensaje al área de conversación, eliminando "user" o "assistant" si está al inicio
  addMessage(sender: string, message: string) {
    // Expresión regular que busca "user " o "assistant " al inicio de la cadena
    const cleanedMessage = message.replace(/^(User:|Assistant)\s/, '');
    this.conversation.push(` ${cleanedMessage}`);
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
    const savedConversation = localStorage.getItem('chatConversation');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      question: this.question.trim(),
      history_chat: savedConversation
    }; // Eliminamos espacios en blanco innecesarios

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


  private resetQuestion(): void {
    this.question = '';
  }

  private updateConversation(question: string, response: string): void {
    // Cambiar "Tu" por "User" y añadir "Assistant" al mensaje de respuesta
    this.conversation.push(`${question}`);
    this.conversation.push(`Assistant: ${response}`);
    this.messageCount++;

    // Guardar la conversación en localStorage
    this.saveConversation();
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



  // Nueva función para cerrar el mensaje de WhatsApp
  closeWhatsAppMessage(): void {
    this.isWhatsAppClosed = true;
    localStorage.setItem('isWhatsAppClosed', JSON.stringify(this.isWhatsAppClosed));
  }

  // Cargar el estado del mensaje de WhatsApp desde localStorage
  loadWhatsAppState(): void {
    const savedWhatsAppState = localStorage.getItem('isWhatsAppClosed');
    this.isWhatsAppClosed = savedWhatsAppState ? JSON.parse(savedWhatsAppState) : false;
  }

  clearConversation(): void {
    localStorage.removeItem('chatConversation');
    localStorage.removeItem('messageCount');
    localStorage.removeItem('isWhatsAppClosed');

    // Limpiar la conversación en la pantalla
    this.conversation = [];
    this.messageCount = 0;
    this.isWhatsAppClosed = false;
  }

  validateEmail(): void {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  }

  closeChat() {
    this.closeChatEvent.emit(); // Emitimos el evento para cerrar el chat
  }
}