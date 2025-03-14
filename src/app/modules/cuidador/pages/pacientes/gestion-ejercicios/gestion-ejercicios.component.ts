import { Component, OnInit } from '@angular/core';
import { EjercicioPersonaService } from '../../../../../core/cuidador/ejercicio-persona/ejercicio-persona.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion-ejercicios',
  templateUrl: './gestion-ejercicios.component.html',
  styles: ``,
})
export class GestionEjerciciosComponent implements OnInit {
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
  }
  constructor(
    private ejercicioPersonaService: EjercicioPersonaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      if (data && data.count_ejercicioP) {
        const countData = data.count_ejercicioP;
        this.cards[0].count = countData.pacientesEstables;
        this.cards[1].count = countData.ejerciciosAsignados;
        this.cards[2].count = countData.pacientesPendientes;
      } else {
        console.error('No se encontraron datos de referentes.');
      }
    });
  }

  mostrarCountPacienteEjercicio() {
    this.ejercicioPersonaService.getCountEjercicio().subscribe(
      (datas: any) => {
        console.log(datas);
        this.cards[0].count = datas.pacientesEstables;
        this.cards[1].count = datas.ejerciciosAsignados;
        this.cards[2].count = datas.pacientesPendientes;
      },
      (error) => {
        console.error('Error al obtener los datos de referentes:', error);
      }
    );
  }
}
