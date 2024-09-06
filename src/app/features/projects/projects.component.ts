import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardProjectComponent } from './card-project/card-project.component';
import { Project } from '../../models/project';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardProjectComponent, CommonModule, HttpClientModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  data!: Project[];
  constructor(private http: HttpClient) { }
  ngOnInit() {

    // Suscribe
    this.http.get<Project[]>('data/projects.json')
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
