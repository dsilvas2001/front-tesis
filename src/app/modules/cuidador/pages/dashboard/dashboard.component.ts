import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styles: ``,
    standalone: false
})
export class DashboardComponent {
  menuVisible = true;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
