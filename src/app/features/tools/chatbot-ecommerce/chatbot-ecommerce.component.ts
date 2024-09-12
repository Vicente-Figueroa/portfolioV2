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
  
    if (response.productos && response.productos.length > 0) {
      message += 'Productos encontrados en la solicitud:\n';
      response.productos.forEach((producto: [string, number]) => {
        message += `- ${producto[0]} (probabilidad: ${producto[1]}%)\n`;
      });
    } else {
      message += 'No se encontraron productos específicos en la solicitud.';
    }
  
    this.conversation.push(`Chatbot: ${message}`);
  }
}