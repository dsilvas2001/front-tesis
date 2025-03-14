import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-main-generate',
  templateUrl: './modal-main-generate.component.html',
  styles: ``,
})
export class ModalMainGenerateComponent {
  @Input() _pacienteGenerate: any;
  nombrePaciente: string = 'PEDRO';

  @Output() cerrarModal = new EventEmitter<void>(); // Emite un evento para cerrar el modal

  ejerciciosGenerados: any[] = []; // Almacena los ejercicios generados

  generarEjercicios(): void {
    // Simula la generación de ejercicios
    this.ejerciciosGenerados = [
      { titulo: 'Ejercicio 1', descripcion: 'Descripción del ejercicio 1.' },
      { titulo: 'Ejercicio 2', descripcion: 'Descripción del ejercicio 2.' },
      { titulo: 'Ejercicio 3', descripcion: 'Descripción del ejercicio 3.' },
    ];
  }

  // Método para cerrar el modal
  onCerrarModal(): void {
    this.cerrarModal.emit();
  }
}
