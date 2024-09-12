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
    let intents: Array<[string, number]> = [];

    // Función auxiliar para formatear la probabilidad
    const formatProbability = (prob: number) => (prob * 100).toFixed(2);

    // Determinar si la respuesta contiene una única intención o múltiples
    if (Array.isArray(response.intenciones) && Array.isArray(response.intenciones[0])) {
      // Múltiples intenciones
      intents = response.intenciones;
    } else if (Array.isArray(response.intenciones) && response.intenciones.length === 2) {
      // Una sola intención
      intents = [response.intenciones as [string, number]];
    } else {
      console.error('Formato de intención no reconocido');
      return;
    }

    // Ordenar intenciones por probabilidad (de mayor a menor)
    intents.sort((a, b) => b[1] - a[1]);

    // Mostrar todas las intenciones probables
    message += "Intenciones detectadas:\n";
    intents.forEach(([intentName, probability]) => {
      message += `- ${intentName} (probabilidad: ${formatProbability(probability)}%)\n`;
    });

    // Procesar la intención principal (la primera después de ordenar)
    const [mainIntentName, mainIntentProbability] = intents[0];
    console.log(`Intención principal detectada: ${mainIntentName} (probabilidad: ${formatProbability(mainIntentProbability)}%)`);


    if (response.productos && response.productos.length > 0) {
      message += 'Productos encontrados:\n';
      response.productos.forEach((producto: [string, number]) => {
        message += `- ${producto[0]} (relevancia: ${producto[1]})\n`;
        console.log(`Producto encontrado: ${producto[0]} (relevancia: ${producto[1]})`);
      });
    } else {
      message += 'No se encontraron productos que coincidan con tu búsqueda.\n';
      console.log('No se encontraron productos que coincidan con la búsqueda.');
    }



    this.addMessage(`Chatbot: ${message}`);
  }
}