import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot-ecommerce',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot-ecommerce.component.html',
  styleUrls: ['./chatbot-ecommerce.component.css']  // Corrección de typo
})
export class ChatbotEcommerceComponent implements OnInit {

  private expandedElements: { [key: string]: boolean } = {};
  private apiUrl = `${environment.apiUrl}/ecommerce_agent/predict-intent/`;
  public conversation: string[] = [];
  public userInput: string = '';
  public loading: boolean = false;
  public messageCount: number = 0;  // Contador de mensajes del usuario

  @ViewChild('conversationContainer') private conversationContainer!: ElementRef;

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  ngOnInit() {
    // Cargar la conversación y el contador desde el almacenamiento local al iniciar
    const savedConversation = localStorage.getItem('conversation');
    const savedMessageCount = localStorage.getItem('messageCount');

    if (savedConversation) {
      this.conversation = JSON.parse(savedConversation);
    }

    if (savedMessageCount) {
      this.messageCount = parseInt(savedMessageCount, 10);
    }
  }

  // Método para guardar la conversación y el contador en localStorage
  private saveToLocalStorage(): void {
    localStorage.setItem('conversation', JSON.stringify(this.conversation));
    localStorage.setItem('messageCount', this.messageCount.toString());
  }

  private scrollToBottom(): void {
    try {
      const container = this.conversationContainer.nativeElement;
      container.scrollTop = container.scrollHeight + 100; // Añadimos 100px extra
    } catch (err) {
      console.error('Error al desplazar:', err);
    }
  }

  trackByFn(index: number, item: string): number {
    return index;
  }

  toggleExpansion(elementId: string): void {
    this.expandedElements[elementId] = !this.expandedElements[elementId];
  }

  isExpanded(elementId: string): boolean {
    return this.expandedElements[elementId] || false;
  }

  sendSuggestion(suggestion: string) {
    this.userInput = suggestion;
    this.sendMessage();
  }

  // Modifica el método existente que añade mensajes a la conversación
  addMessage(message: string, fromUser: boolean = false): void {
    this.conversation.push(message);

    // Solo incrementar el contador si el mensaje es del usuario
    if (fromUser) {
      this.messageCount++;  // Incrementar el contador de mensajes del usuario
      this.saveToLocalStorage();  // Guardar la conversación y el contador en localStorage
    }

    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.ngZone.run(() => {
            this.scrollToBottom();
          });
        });
      });
    });
  }

  sendMessage() {
    if (this.userInput.trim() === '') {
      return;
    }

    this.loading = true;

    // Añadir el mensaje del usuario y marcarlo como "fromUser"
    this.addMessage(`Usuario: ${this.userInput}`, true);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Enviar el número de mensajes del usuario como "step" en la solicitud
    const body = {
      text: this.userInput,
      step: this.messageCount  // Usar el contador de mensajes del usuario como "step"
    };

    this.http.post(this.apiUrl, body, { headers: headers })
      .subscribe((response: any) => {
        this.processResponse(response);
        this.loading = false;
        this.userInput = '';
      }, error => {
        console.error('Error:', error);
        this.addMessage('Error en la comunicación con el servidor.');
        this.loading = false;
      });
  }

  private processResponse(response: any) {
    let message = '';

    // Añadir el texto de entrada del usuario
    message += `Input: ${response.input}\n`;

    // Añadir el paso actual
    message += `Paso: ${response.step}\n\n`;

    // Procesar las intenciones detectadas
    if (response.intent && response.intent.options) {
      message += "Intenciones detectadas:\n";
      for (const [intent, probability] of Object.entries(response.intent.options)) {
        message += `- ${intent}: ${(probability as number * 100).toFixed(2)}%\n`;
      }
      message += '\n';
    }

    // Procesar las posibles acciones siguientes
    if (response.next_action && response.next_action.options) {
      message += "Posibles acciones siguientes:\n";
      for (const [action, probability] of Object.entries(response.next_action.options)) {
        message += `- ${action}: ${(probability as number * 100).toFixed(2)}%\n`;
      }
    }

    // Añadir el mensaje del chatbot
    this.addMessage(`Chatbot: ${message}`);
  }

  clearLocalStorage(): void {
    localStorage.removeItem('conversation');
    localStorage.removeItem('messageCount');
    this.conversation = [];
    this.messageCount = 0;
  }
}