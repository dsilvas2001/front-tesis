import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-ejercicios',
  templateUrl: './gestion-ejercicios.component.html',
  styles: ``,
})
export class GestionEjerciciosComponent {
  pacienteGestion: any;
  cards = [
    {
      title: 'Pacientes Estables',
      count: 0,
      icon: 'fa-solid fa-heart-pulse',
    },
    {
      title: 'Ejercicios Asignados (Hoy)',
      count: 0,
      icon: 'fa-solid fa-chalkboard',
    },
    {
      title: 'Ejercicios Pendientes (Hoy)',
      count: 0,
      icon: 'fa-solid fa-clock',
    },
  ];

  onUserIdReceived(paciente: any) {
    this.pacienteGestion = paciente;
    console.log('pacienteGestion');
    console.log('pacienteGestion');
    console.log(paciente);
  }
}
