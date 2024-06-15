import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardsComponent } from './cards/cards.component';
import { Resume } from '../../models/resume';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CardsComponent, CommonModule, HttpClientModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent implements OnInit {
  data!: Resume;

  constructor(private http: HttpClient) { }


  ngOnInit() {
    this.http.get<Resume>('data/resume.json')
      .subscribe(
        (data) => {
          console.log('Datos cargados:', data);
          this.data = data;
        },
        (error) => {
          console.error('Error al cargar los datos:', error);
        }
      );
  }
}
