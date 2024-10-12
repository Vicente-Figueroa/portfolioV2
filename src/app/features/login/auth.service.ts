import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() { }

    // Guardar el token en localStorage
    setToken(token: string) {
        localStorage.setItem('authToken', token);
    }

    // Obtener el token desde localStorage
    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    // Eliminar el token al cerrar sesión
    clearToken() {
        localStorage.removeItem('authToken');
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }
}
