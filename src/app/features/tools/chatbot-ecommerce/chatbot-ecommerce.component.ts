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
    let message = `Intención detectada: ${response.intent}\n`;

    if (response.intent === 'consulta_producto') {
      if (response.productos && response.productos.length > 0) {
        message += 'Productos encontrados:\n';
        response.productos.forEach((producto: [string, number]) => {
          message += `- ${producto[0]} (probabilidad: ${producto[1]}%)\n`;
        });
      } else {
        message += 'No se encontraron productos que coincidan con tu búsqueda.';
      }
    } else {
      // Manejo de otras intenciones
      if (response.productos && response.productos.length > 0) {
        message += 'Productos mencionados en la solicitud:\n';
        response.productos.forEach((producto: [string, number]) => {
          message += `- ${producto[0]} (probabilidad: ${producto[1]}%)\n`;
        });
      }
    }

    // Agregar información adicional específica de la intención
    switch (response.intent) {
      case 'envio_seguimiento':
        message += '\nPara seguimiento de envío, por favor proporciona el número de orden.';
        break;
      case 'proceso_devolucion':
        message += '\nPara iniciar una devolución, necesitamos el número de orden y el motivo.';
        break;
      case 'informacion_compra':
        message += '\nPara obtener información de compra, por favor proporciona el número de orden.';
        break;
      // Puedes agregar más casos según sea necesario
    }

    this.conversation.push(`Chatbot: ${message}`);
  }
}