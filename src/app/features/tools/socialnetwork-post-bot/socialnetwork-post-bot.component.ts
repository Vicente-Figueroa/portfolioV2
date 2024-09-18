import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PostData } from '../../../models/post-data';

@Component({
  selector: 'app-socialnetwork-post-bot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './socialnetwork-post-bot.component.html',
  styleUrl: './socialnetwork-post-bot.component.css'
})
export class SocialnetworkPostBotComponent implements OnInit {
  post: PostData = {
    services: '',
    target: '',
    businessName: '',
    content: '',
    includePhoto: false,
    photoUrl: '',
    useFacebookToken: false,
    facebookToken: ''
  };
  isConfigOpen = false;
  isEditMode = false;
  isSubmitting = false;

  private apiUrl = 'https://bot-publicaciones-vercel.vercel.app/genai-post-fb';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadSavedData();
  }

  toggleConfig() {
    this.isConfigOpen = !this.isConfigOpen;
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  submitPost() {
    this.isSubmitting = true;
    this.showSpinner();
    const payload = {
      services: this.post.services,
      target: this.post.target,
      business_name: this.post.businessName,
      content: this.post.content,
      include_photo: this.post.includePhoto,
      photo_url: this.post.includePhoto ? this.post.photoUrl : undefined,
      token: this.post.useFacebookToken ? this.post.facebookToken : ''
    };

    this.http.post(this.apiUrl, payload).subscribe(
      response => {
        console.log('Post creado exitosamente:', response);
        // Aquí puedes manejar la respuesta exitosa, por ejemplo, mostrando un mensaje al usuario
        this.isSubmitting = false;
        this.hideSpinner();
        this.showSuccessOverlay();
      },
      error => {
        console.error('Error al crear el post:', error);
        // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
        this.isSubmitting = false;
        this.hideSpinner();
        alert("error")
      }
    );
  }

  savePreferences() {
    const dataToSave = { ...this.post };
    if (dataToSave.facebookToken) {
      dataToSave.facebookToken = btoa(dataToSave.facebookToken);
    }
    localStorage.setItem('postPreferences', JSON.stringify(dataToSave));
    alert('Preferencias guardadas correctamente');
    this.isEditMode = false;
  }

  loadSavedData() {
    const savedData = localStorage.getItem('postPreferences');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.facebookToken) {
        parsedData.facebookToken = atob(parsedData.facebookToken);
      }
      this.post = { ...this.post, ...parsedData };
    }
  }

  clearSavedData() {
    localStorage.removeItem('postPreferences');
    this.post = {
      services: '',
      target: '',
      businessName: '',
      content: '',
      includePhoto: false,
      photoUrl: '',
      useFacebookToken: false,
      facebookToken: ''
    };
    alert('Datos borrados correctamente');
  }

  quickSubmit() {
    this.loadSavedData();
    this.submitPost();
  }

  showSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'flex';
  }

  hideSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) spinner.style.display = 'none';
  }

  showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) overlay.style.display = 'flex';

    const closeButton = document.getElementById('closeOverlay');
    if (closeButton) {
      closeButton.onclick = () => {
        if (overlay) overlay.style.display = 'none';
      };
    }
  }
}