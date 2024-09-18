import { Component, OnInit } from '@angular/core';
import { ServerStatusComponent } from '../server-status/server-status.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [ServerStatusComponent, CommonModule, FormsModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public debugMode: boolean = false;

  ngOnInit() {
    const savedDebugMode = localStorage.getItem('navDebugMode');
    if (savedDebugMode === null) {
      localStorage.setItem('navDebugMode', 'false');
      this.debugMode = false;
    } else {
      this.debugMode = savedDebugMode === 'true';
    }
  }

  toggleNavDebugMode(newValue: boolean) {
    localStorage.setItem('navDebugMode', newValue.toString());
  }

  resetOnboarding() {
    localStorage.removeItem('hasSeenOnboarding');
    alert('¡Se recargará la página!');
    window.location.reload();
  }
}