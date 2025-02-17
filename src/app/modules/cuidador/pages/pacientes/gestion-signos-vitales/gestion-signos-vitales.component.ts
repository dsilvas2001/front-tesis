import { Component } from '@angular/core';
import { ReferenciaSignosVService } from '../../../../../core/cuidador/referencia-signosV/referencia-signos-v.service';
import { ActivatedRoute } from '@angular/router';

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
      icon: 'fa-solid fa-heart-circle-check',
    },
    {
      title: 'Emergencia (Hoy)',
      count: 5,
      icon: 'fa-solid fa-heart-circle-exclamation',
    },

    {
      title: 'SV sin registrar',
      count: 10,
      icon: 'fa-solid fa-heart-circle-xmark',
    },
  ];
  mostrarCalendario: any;

  constructor(
    private referenciaSignosVService: ReferenciaSignosVService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      if (data && data.count_referencias) {
        const countData = data.count_referencias;

        this.cards[0].count = countData.count_referentes;
        this.cards[1].count = countData.count_referentes_hoy;
        this.cards[2].count = countData.count_sin_referentes;
        this.cards[3].count = countData.count_femenino;
      } else {
        console.error('No se encontraron datos de referentes.');
      }
    });
  }

  mostrarCountPaciente() {
    this.referenciaSignosVService.getCountReferencia().subscribe(
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

  //
}
