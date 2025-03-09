import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../../../core/cuidador/paciente/paciente.service';
import { ActivatedRoute } from '@angular/router';
import { ReferenciaSignosVService } from '../../../../../core/cuidador/referencia-signosV/referencia-signos-v.service';

@Component({
  selector: 'app-limites-signos-vitales',
  templateUrl: './limites-signos-vitales.component.html',
  styles: ``,
})
export class LimitesSignosVitalesComponent implements OnInit {
  cards = [
    {
      title: 'Valor Referencial SV',
      count: 0,
      icon: 'fa-solid fa-gears',
    },
    {
      title: 'SV del Dia',
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
}
