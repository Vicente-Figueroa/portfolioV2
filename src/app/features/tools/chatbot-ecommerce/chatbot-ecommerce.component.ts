import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot-ecommerce',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot-ecommerce.component.html',
  styleUrl: './chatbot-ecommerce.component.css'
})


export class ChatbotEcommerceComponent {

  private expandedElements: { [key: string]: boolean } = {};

  constructor(private http: HttpClient, private ngZone: NgZone) { }
  private apiUrl = `${environment.apiUrl}/ecommerce_agent/predict-intent/`;
  public conversation: string[] = [];
  public userInput: string = '';
  public loading: boolean = false;


  @ViewChild('conversationContainer') private conversationContainer!: ElementRef;


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
  addMessage(message: string): void {
    this.conversation.push(message);
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
    this.addMessage(`Usuario: ${this.userInput}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      text: this.userInput,
      step: 1  // Siempre 1 por ahora
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

    this.addMessage(`Chatbot: ${message}`);
  }
}