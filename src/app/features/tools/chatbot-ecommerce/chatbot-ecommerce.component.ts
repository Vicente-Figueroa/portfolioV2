import { Component } from '@angular/core';
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
  private apiUrl = `${environment.apiUrl}/ecommerce_agent/intent_product/`;
  public conversation: string[] = [];
  public userInput: string = '';
  public loading: boolean = false;

  constructor(private http: HttpClient) { }

  sendSuggestion(suggestion: string) {
    this.userInput = suggestion;
    this.sendMessage();
  }

  sendMessage() {
    if (this.userInput.trim() === '') return;

    this.loading = true;
    this.conversation.push(`Usuario: ${this.userInput}`);

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
        this.conversation.push('Error en la comunicación con el servidor.');
        this.loading = false;
      });
  }

  private processResponse(response: any) {
    let message = '';
    let intents: Array<[string, number]> = [];
  
    // Función auxiliar para formatear la probabilidad
    const formatProbability = (prob: number) => (prob * 100).toFixed(2);
  
    // Determinar si la respuesta contiene una única intención o múltiples
    if (Array.isArray(response.intent) && Array.isArray(response.intent[0])) {
      // Múltiples intenciones
      intents = response.intent;
    } else if (Array.isArray(response.intent) && response.intent.length === 2) {
      // Una sola intención
      intents = [response.intent as [string, number]];
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
  
    // Manejar la intención principal
    switch (mainIntentName) {
      case 'consulta_producto':
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
        break;
      case 'envio_seguimiento':
        message += 'Para seguimiento de envío, por favor proporciona el número de orden.\n';
        console.log('Se solicitó seguimiento de envío.');
        break;
      case 'informacion':
        message += 'Estoy aquí para proporcionarte información. ¿Qué te gustaría saber?\n';
        console.log('Se solicitó información.');
        break;
      case 'saludo_despedida':
        message += '¡Hola! ¿En qué puedo ayudarte hoy?\n';
        console.log('Se detectó un saludo o despedida.');
        break;
      default:
        message += 'Entiendo tu consulta. ¿Podrías proporcionar más detalles para ayudarte mejor?\n';
        console.log('No se pudo determinar la intención específica de la consulta.');
    }
  
    this.conversation.push(`Chatbot: ${message}`);
  }
}