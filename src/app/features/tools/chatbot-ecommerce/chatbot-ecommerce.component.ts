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
  styleUrls: ['./chatbot-ecommerce.component.css']
})
export class ChatbotEcommerceComponent implements OnInit {

  private expandedElements: { [key: string]: boolean } = {};
  private apiUrl = `${environment.apiUrl}/ecommerce_agent/predict-intent/`;
  public conversation: string[] = [];
  public userInput: string = '';
  public loading: boolean = false;
  public messageCount: number = 0;
  public debugMode: boolean = true; // Inicialmente en false, para evitar conflictos

  @ViewChild('conversationContainer') private conversationContainer!: ElementRef;

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  ngOnInit() {
    // Cargar el modo debug guardado en localStorage, si existe
    const savedDebugMode = localStorage.getItem('debugMode');

    // Si existe en localStorage, usar ese valor, de lo contrario, inicializar en false
    this.debugMode = savedDebugMode === 'true';

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

  // Método para manejar el cambio de debugMode y guardarlo en localStorage
  onDebugModeChange(newValue: boolean): void {
    this.debugMode = newValue;
    localStorage.setItem('debugMode', this.debugMode.toString());
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

    // Incrementar el contador solo si el mensaje es del usuario
    if (fromUser) {
      this.messageCount++;  // Incrementar el contador de mensajes del usuario
    }

    this.saveToLocalStorage();  // Guardar la conversación y el contador en localStorage

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
    let metadataMessage = '';
    let agentMessage = '';

    // Modo de depuración: muestra información detallada solo si debugMode es true
    if (this.debugMode) {
      metadataMessage += `Input: ${response.input}\n`;
      metadataMessage += `Paso: ${response.step}\n\n`;

      if (response.intent && response.intent.options) {
        metadataMessage += "Intenciones detectadas:\n";
        for (const [intent, probability] of Object.entries(response.intent.options)) {
          metadataMessage += `- ${intent}: ${(probability as number * 100).toFixed(2)}%\n`;
        }
        metadataMessage += '\n';
      }

      if (response.next_action && response.next_action.options) {
        metadataMessage += "Posibles acciones a ejecutar:\n";
        for (const [action, probability] of Object.entries(response.next_action.options)) {
          metadataMessage += `- ${action}: ${(probability as number * 100).toFixed(2)}%\n`;
        }
        metadataMessage += '\n';
      }

      if (response.agent) {
        metadataMessage += `Agente: ${response.agent}\n\n`;
      }

      // Añadir la metadata como un mensaje separado
      this.addMessage(`Chatbot (Metadata): ${metadataMessage}`);
    }

    // Preparar la respuesta del agente
    if (response.agent_response) {
      agentMessage = response.agent_response;
    } else {
      agentMessage = "Lo siento, no pude generar una respuesta en este momento.";
    }

    // Añadir la respuesta del agente como un mensaje separado
    this.addMessage(`Chatbot: ${agentMessage}`);
  }

  clearLocalStorage(): void {
    localStorage.removeItem('conversation');
    localStorage.removeItem('messageCount');
    localStorage.removeItem('debugMode'); // Limpiar el modo debug
    this.conversation = [];
    this.messageCount = 0;
    this.debugMode = true; // Resetear el modo debug a true
  }
}