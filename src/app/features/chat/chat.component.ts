import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  message!: string;
  constructor(private http: HttpClient) { }
  ngOnInit(): void {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.get('https://apiv-pi.vercel.app/chat', { headers: headers })
      .subscribe((response: any) => {
        //this.message = response['message'];
        this.message = response.message.replace(/```/g, '').replace(/\n/g, '');
        console.log(this.message);
      });
  }
}



