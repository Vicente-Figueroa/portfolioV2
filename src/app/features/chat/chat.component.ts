import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  message!: string;
  email!: string;
  question!: string; // Agregamos una variable para almacenar la pregunta del usuario
  conversation: string[] = []; // Agregamos un array para almacenar la conversación
  loading = true;
  messageCount = 0; // Agregamos una variable para contar los mensajes enviados
  showPopup = false; // Variable para controlar la visibilidad del popup

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Animation
    gsap.fromTo(
      '.chat',
      { opacity: 0 }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: '.projects', // El trigger ahora es la propia sección ".projects"
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    this.getInitialMessage(); // Llamamos a la función para obtener el mensaje inicial
  }
  getInitialMessage() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .get('https://apiv-pi.vercel.app/chat', { headers: headers })
      .subscribe((response: any) => {
        this.message = response.message.replace(/```/g, '').replace(/\n/g, '');
        this.conversation.push(this.message); // Agregamos el mensaje inicial a la conversación
        console.log(this.message);
        this.loading = false;
      });
  }

  askQuestion() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (this.question) {
      const body = { question: this.question }; // Creamos un objeto con la pregunta del usuario

      this.http
        .post('https://apiv-pi.vercel.app/chat', body, { headers: headers })
        .subscribe((response: any) => {
          this.message = response.message
            .replace(/```/g, '')
            .replace(/\n/g, '');
          this.conversation.push(`Tu: ${this.question}`); // Agregamos la pregunta del usuario a la conversación
          this.conversation.push(this.message); // Agregamos la respuesta del backend a la conversación
          console.log(this.message);

          this.question = '';
          this.messageCount++; // Incrementamos el contador de mensajes
          console.log(this.messageCount);

          if (this.messageCount == 2) {
            this.showPopup = true; // Mostramos el popup después de 3 mensajes
          }
          else{
            this.showPopup = false; // Mostramos el popup después de 3 mensajes

          }
        });
    }
  }
  closePopup() {
    if (this.email) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      const body = { email: this.email };

      this.http
        .post('https://apiv-pi.vercel.app/send-email', body, {
          headers: headers,
        })
        .subscribe(
          (response: any) => {
            console.log('Correo enviado:', response);
            this.email = ''; // Limpiar el campo de correo después de enviarlo
            this.showPopup = false; // Cerrar el popup después de enviar el correo
          },
          (error) => {
            console.error('Error al enviar el correo:', error);
            // Manejar el error de acuerdo a tus necesidades
          }
        );
    }
  }
}
