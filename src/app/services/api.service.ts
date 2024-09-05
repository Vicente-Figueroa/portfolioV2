import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importa el entorno

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl; // Usa la URL del entorno

  constructor(private http: HttpClient) { }

  // Ejemplo de una petición GET
  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data`);
  }

}