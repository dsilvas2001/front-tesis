import { Component, OnInit } from '@angular/core';
import { EjercicioPersonaService } from '../../../../../core/cuidador/ejercicio-persona/ejercicio-persona.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-gestion-ejercicios',
  templateUrl: './gestion-ejercicios.component.html',
  styles: ``,
  standalone: false,
})
export class GestionEjerciciosComponent implements OnInit {
  pacienteGestion: any;
  cards = [
    {
      title: 'Pacientes estables',
      count: 0,
      icon: 'fa-solid fa-heart-pulse',
    },
    {
      title: 'Ejercicios completados (Hoy)',
      count: 0,
      icon: 'fa-solid fa-chalkboard',
    },
    {
      title: 'Ejercicios pendientes (Hoy)',
      count: 0,
      icon: 'fa-solid fa-clock',
    },
  ];

  onUserIdReceived(paciente: any) {
    this.pacienteGestion = paciente;
  }
  constructor(
    private ejercicioPersonaService: EjercicioPersonaService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      if (data && data.count_ejercicioP) {
        const countData = data.count_ejercicioP;
        this.cards[0].count = countData.pacientesEstables;
        this.cards[1].count = countData.pacientesCompletados;
        this.cards[2].count = countData.pacientesPendientes;
      } else {
        console.error('No se encontraron datos de referentes.');
      }
    });
  }

  mostrarCountPacienteEjercicio() {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Decodificar el token para obtener la información del centro
    const decodedToken = this.authService.getDecodedToken(token);

    if (!decodedToken?.centro_info?.id) {
      throw new Error('El usuario no tiene un centro asignado');
    }

    const centroId = decodedToken.centro_info.id;

    this.ejercicioPersonaService.getCountEjercicio(centroId).subscribe(
      (datas: any) => {
        console.log(datas);
        this.cards[0].count = datas.pacientesEstables;
        this.cards[1].count = datas.pacientesCompletados;
        this.cards[2].count = datas.pacientesPendientes;
      },
      (error) => {
        console.error('Error al obtener los datos de referentes:', error);
      }
    );
  }
}
