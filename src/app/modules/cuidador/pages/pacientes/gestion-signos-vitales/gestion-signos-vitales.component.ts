import { Component, OnInit } from '@angular/core';
import { ReferenciaSignosVService } from '../../../../../core/cuidador/referencia-signosV/referencia-signos-v.service';
import { ActivatedRoute } from '@angular/router';
import { SignosVitalesService } from '../../../../../core/cuidador/signos-vitales/signos-vitales.service';
import { AuthService } from '../../../../../core/auth/auth.service';

@Component({
  selector: 'app-gestion-signos-vitales',
  templateUrl: './gestion-signos-vitales.component.html',
  styles: ``,
  standalone: false,
})
export class GestionSignosVitalesComponent implements OnInit {
  cards = [
    { title: 'Pacientes agregados', count: 0, icon: 'fa-solid fa-user' },
    {
      title: 'Signos vitales (Hoy)',
      count: 0,
      icon: 'fa-solid fa-heart-circle-check',
    },
    {
      title: 'Emergencia (Hoy)',
      count: 0,
      icon: 'fa-solid fa-heart-circle-exclamation',
    },

    {
      title: 'SV sin registrar',
      count: 0,
      icon: 'fa-solid fa-heart-circle-xmark',
    },
  ];
  mostrarCalendario: any;
  fechaCards: string = '';

  constructor(
    private signosVitalesService: SignosVitalesService,
    private authService: AuthService,

    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      if (data && data.count_sv) {
        const countData = data.count_sv;
        this.cards[0].count = countData.count_pacientes_hoy;
        this.cards[1].count = countData.count_signos_vitales_hoy;
        this.cards[2].count = countData.count_emergencia_hoy;
        this.cards[3].count = countData.count_sin_registrar;
      } else {
        console.error('No se encontraron datos de referentes.');
      }
    });
  }

  onDateReceived(fecha: string) {
    this.fechaCards = fecha;
    console.log('fecha');
    console.log('fecha');
    console.log(fecha);
    this.mostrarCountPaciente(fecha);
  }

  mostrarCountPaciente(fecha: string) {
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

    this.signosVitalesService.countgetSignosV(fecha, centroId).subscribe(
      (datas: any) => {
        this.cards[0].count = datas.count_pacientes_hoy;
        this.cards[1].count = datas.count_signos_vitales_hoy;
        this.cards[2].count = datas.count_emergencia_hoy;
        this.cards[3].count = datas.count_sin_registrar;
      },
      (error) => {
        console.error('Error al obtener los datos de referentes:', error);
      }
    );
  }

  countPacienteReceived() {
    this.mostrarCountPaciente(this.fechaCards);
  }

  //
}
