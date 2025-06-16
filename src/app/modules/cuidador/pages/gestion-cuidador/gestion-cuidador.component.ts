import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuidadorService } from '../../../../core/cuidador/cuidador.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-gestion-cuidador',
  standalone: false,
  templateUrl: './gestion-cuidador.component.html',
  styles: ``,
})
export class GestionCuidadorComponent {
  cards = [
    { title: 'Cuidadores agregados', count: 0, icon: 'fa-solid fa-user' },
    {
      title: 'Cuidadores con necesidad de aprobación',
      count: 0,
      icon: 'fa-solid fa-user-clock',
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private cuidadorService: CuidadorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      if (data) {
        this.cards[0].count = data.count_cuidadores || 0;
        this.cards[1].count = data.count_pendientes || 0;
      } else {
        console.error('No se encontraron datos de cuidadores.');
      }
    });
  }

  mostrarCountCuidadores() {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    const decodedToken = this.authService.getDecodedToken(token);

    if (!decodedToken?.centro_info?.id) {
      throw new Error('El usuario no tiene un centro asignado');
    }

    const centroId = decodedToken.centro_info.id;

    this.cuidadorService.getCountCuidadores(centroId).subscribe(
      (data: { aprobados: number; noAprobados: number }) => {
        this.cards[0].count = data.aprobados || 0;
        this.cards[1].count = data.noAprobados || 0;
      },
      (error) => {
        console.error('Error al obtener los datos de cuidadores:', error);
      }
    );
  }

  countCuidadorReceived() {
    this.mostrarCountCuidadores();
  }
}
