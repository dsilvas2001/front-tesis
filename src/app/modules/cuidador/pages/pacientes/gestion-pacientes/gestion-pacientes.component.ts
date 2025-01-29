import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-pacientes',
  templateUrl: './gestion-pacientes.component.html',
  styles: ``,
})
export class GestionPacientesComponent {
  cards = [
    { title: 'Pacientes Agregados', count: 120, icon: 'fa-solid fa-user' },
    {
      title: 'Pacientes Agregados (Hoy)',
      count: 5,
      icon: 'fa-solid fa-user-check',
    },

    {
      title: 'Genero Masculino',
      count: 10,
      icon: 'fa-solid fa-mars-stroke',
    },
    {
      title: 'Genero Femenino',
      count: 10,
      icon: 'fa-solid fa-venus',
    },
  ];
}
