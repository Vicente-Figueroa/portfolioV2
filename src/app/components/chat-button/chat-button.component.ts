import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatComponent } from './chat/chat.component';

@Component({
  selector: 'app-chat-button',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  templateUrl: './chat-button.component.html',
  styleUrls: ['./chat-button.component.css']
})
export class ChatButtonComponent {
  chatVisible: boolean = false;

  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }

  closeChat() {
    this.chatVisible = false; // Oculta el chat cuando se recibe el evento
  }
}