import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../../../../core/cuidador/paciente/paciente.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gestion-pacientes',
  templateUrl: './gestion-pacientes.component.html',
  styles: ``,
})
export class GestionPacientesComponent implements OnInit {
  cards = [
    { title: 'Pacientes Agregados', count: 0, icon: 'fa-solid fa-user' },
    {
      title: 'Pacientes Nuevos',
      count: 0,
      icon: 'fa-solid fa-user-check',
    },

    {
      title: 'Genero Masculino',
      count: 0,
      icon: 'fa-solid fa-mars-stroke',
    },
    {
      title: 'Genero Femenino',
      count: 0,
      icon: 'fa-solid fa-venus',
    },
  ];
  count_pacientes: any[] = [];

  constructor(
    private pacienteServices: PacienteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const resolvedData = this.route.snapshot.data['data'];

    console.log('resolvedData:', resolvedData);

    if (resolvedData) {
      const countData = resolvedData.count_pacientes;

      this.cards[0].count = countData.count_pacientes;
      this.cards[1].count = countData.count_paciente_hoy;
      this.cards[2].count = countData.count_masculino;
      this.cards[3].count = countData.count_femenino;
    } else {
      console.error('No se encontraron datos de pacientes.');
    }
  }

  mostrarCountPaciente() {
    this.pacienteServices.getCountPaciente().subscribe(
      (datas: any) => {
        this.cards[0].count = datas.count_pacientes;
        this.cards[1].count = datas.count_paciente_hoy;
        this.cards[2].count = datas.count_masculino;
        this.cards[3].count = datas.count_femenino;
      },
      (error) => {
        console.error('Error al obtener los datos de pacientes:', error);
      }
    );
  }

  countPacienteReceived() {
    this.mostrarCountPaciente();
  }
}
