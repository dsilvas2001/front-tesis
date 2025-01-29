import { Component } from '@angular/core';

@Component({
  selector: 'app-gestion-signos-vitales',
  templateUrl: './gestion-signos-vitales.component.html',
  styles: ``,
})
export class GestionSignosVitalesComponent {
  cards = [
    { title: 'Pacientes Agregados', count: 120, icon: 'fa-solid fa-user' },
    {
      title: 'Signos Vitales (Hoy)',
      count: 5,
      icon: 'fa-solid fa-magnifying-glass',
    },
    {
      title: 'Ejercicios Generados (Hoy)',
      count: 10,
      icon: 'fa-solid fa-house',
    },
  ];
}
