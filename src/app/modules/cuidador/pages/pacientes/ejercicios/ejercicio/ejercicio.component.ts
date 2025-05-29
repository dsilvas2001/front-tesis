import { Component } from '@angular/core';

@Component({
    selector: 'app-ejercicio',
    templateUrl: './ejercicio.component.html',
    styles: ``,
    standalone: false
})
export class EjercicioComponent {
  modalVisible: boolean = false;

  openModal(): void {
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }
}
