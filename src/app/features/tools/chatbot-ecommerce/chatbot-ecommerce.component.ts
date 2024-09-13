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
  private apiUrl = `${environment.apiUrl}/ecommerce_agent/intent_product/`;
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

    const body = { message: this.userInput };

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
  
    // Función auxiliar para formatear la probabilidad
    const formatProbability = (prob: number) => (prob * 100).toFixed(2);
  
    // Procesar intención inicial
    if (response.intencion_inicial && response.intencion_inicial.length > 0) {
      const [intentName, probability] = response.intencion_inicial[0];
      message += `Intención inicial: ${intentName} (probabilidad: ${formatProbability(probability)}%)\n`;
    }
  
    // Procesar intenciones secundarias
    if (response.intencion_secundaria && response.intencion_secundaria.length > 0) {
      message += "Intenciones secundarias:\n";
      response.intencion_secundaria.forEach(([intentName, probability]: [string, number]) => {
        message += `- ${intentName} (probabilidad: ${formatProbability(probability)}%)\n`;
      });
    }
  
    // Procesar productos
    if (response.productos && response.productos.length > 0) {
      message += 'Productos encontrados:\n';
      response.productos.forEach((producto: [string, number]) => {
        message += `- ${producto[0]} (relevancia: ${producto[1]})\n`;
      });
    } else {
      message += 'No se encontraron productos que coincidan con tu búsqueda.\n';
    }
  
    this.addMessage(`Chatbot: ${message}`);
  }
}