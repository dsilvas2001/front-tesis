import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../../../core/cuidador/paciente/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { ReferenciaSignosVService } from '../../../../../core/cuidador/referencia-signosV/referencia-signos-v.service';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-limites-signos-vitales',
  templateUrl: './limites-signos-vitales.component.html',
  styles: ``,
  standalone: false,
})
export class LimitesSignosVitalesComponent implements OnInit {
  cards = [
    {
      title: 'Valor Referencial SV',
      count: 0,
      icon: 'fa-solid fa-gears',
    },
    {
      title: 'SV del Día',
      count: 0,
      icon: 'fa-solid fa-user-gear',
    },

    {
      title: 'Pacientes sin Rangos',
      count: 0,
      icon: 'fa-solid fa-user-xmark',
    },
  ];
  count_pacientes: any[] = [];
  centroId: any = null;

  constructor(
    private referenciaSignosVService: ReferenciaSignosVService,
    private authService: AuthService,

    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Decodificar el token para obtener la información del centro
    const decodedToken = this.authService.getDecodedToken(token);

    if (!decodedToken?.centro_info?.id) {
      throw new Error('El usuario no tiene un centro asignado');
    }

    this.centroId = decodedToken.centro_info.id;
    this.route.data.subscribe(({ data }) => {
      if (data && data.count_referencias) {
        const countData = data.count_referencias;

        this.cards[0].count = countData.count_referentes;
        this.cards[1].count = countData.count_referentes_hoy;
        this.cards[2].count = countData.count_sin_referentes;
      } else {
        console.error('No se encontraron datos de referentes.');
      }
    });
  }

  mostrarCountPaciente() {
    this.referenciaSignosVService.getCountReferencia(this.centroId).subscribe(
      (datas: any) => {
        this.cards[0].count = datas.count_referentes;
        this.cards[1].count = datas.count_referentes_hoy;
        this.cards[2].count = datas.count_sin_referentes;
      },
      (error) => {
        console.error('Error al obtener los datos de referentes:', error);
      }
    );
  }

  countPacienteReceived() {
    this.mostrarCountPaciente();
  }
}
