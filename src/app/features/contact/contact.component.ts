import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,

  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  contact = {
    name: '', // y otros campos que necesites,
    issue: '',// y otros campos que necesites
    message: '' // y otros campos que necesites
  };
  submitted = false;
  showSuccessMessage = false;
  name!: string;

  constructor(private http: HttpClient) { }
  ngOnInit() {
    // Animation
    const tl = gsap.timeline();
    tl.fromTo('.tittle',
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".projects", // El trigger ahora es la propia sección ".projects"
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
    tl.fromTo('.form',
      { opacity: 0, y: '-10%' }, // Estado inicial: transparente y ligeramente desplazado hacia arriba
      {
        opacity: 1, // Estado final: opacidad total
        y: '0%', // Volver a la posición original en Y
        duration: 3,
        scrollTrigger: {
          trigger: ".projects", // El trigger ahora es la propia sección ".projects"
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      },">-2"
    );
  }
  submitForm() {
    this.submitted = true;

    // Aquí puedes agregar lógica adicional, como enviar los datos a un servidor.
    // ...

    // No restablezcas el objeto contact aquí si quieres que el nombre se siga mostrando en el HTML
    console.log(this.contact); // Muestra el nombre en la consola
    this.name = this.contact.name;


    const contactData = {
      name: this.contact.name,
      issue: this.contact.issue,
      message: this.contact.message
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.post('http://localhost:5000/items', contactData, { headers: headers })
      .subscribe(response => {
        console.log(response);
        // Maneja la respuesta del servidor aquí
      }, error => {
        console.error(error);
        // Maneja el error aquí
      });

    this.contact = {
      name: '', // y otros campos que necesites,
      issue: '',// y otros campos que necesites
      message: '' // y otros campos que necesites
    }; // Esto limpiaría el formulario
    // Muestra el mensaje de éxito
    this.showSuccessMessage = true;

    // Opcional: Oculta el mensaje después de un tiempo
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 5000); // Oculta después de 3 segundos, por ejemplo
    this.submitted = false; // Esto ocultaría los datos en el HTML
  }

}
