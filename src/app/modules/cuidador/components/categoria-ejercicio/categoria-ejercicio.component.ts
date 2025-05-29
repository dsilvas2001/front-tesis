import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { EjercicioPersonaService } from '../../../../core/cuidador/ejercicio-persona/ejercicio-persona.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-categoria-ejercicio',
  templateUrl: './categoria-ejercicio.component.html',
  styles: ``,
  standalone: false,
})
export class CategoriaEjercicioComponent implements OnInit, OnChanges {
  @Input() _pacienteData: any;
  vibilitiCategoria: boolean = false;
  showInfo: boolean = false; // Controla la visibilidad de la ventana de información
  categoriasFiltradas: any[] = []; // Categorías filtradas según el servicio
  descripcionServicio: string = ''; // Descripción retornada por el servicio
  //loading
  isLoading = false;
  modoSeleccion: 'ia' | 'manual' = 'ia';
  categoriasRecomendadasIA: any[] = [];
  razonesRecomendacion: { [key: string]: string } = {
    Memoria: 'Basado en su historial de ejercicios cognitivos recientes',
    Atención: 'Para mejorar su capacidad de concentración actual',
    Lenguaje: 'Según su progreso en comunicación verbal',
  };

  // MODAL
  statusModal: boolean = false;
  _pacienteCategoria: any;

  categorias = [
    {
      src: 'https://img.freepik.com/free-vector/flat-alzheimer-concept-illustration_23-2149042102.jpg?t=st=1741787152~exp=1741790752~hmac=d9af9c8ac4363c84770960fd9f1d452bbd8c31d50de731355b29d0e8350631ec&w=900',
      nombre: 'Memoria',
      explicacion: 'Mejora tu capacidad para recordar información importante.',
    },
    {
      src: 'https://img.freepik.com/free-photo/lonely-woman-confronting-alzheimer-disease_23-2149043761.jpg?t=st=1741625290~exp=1741628890~hmac=bf27b52da86b074771876011bd9e150ccbc82b1cb00b2c48210d86e1fdc9643f&w=740',
      nombre: 'Atención',
      explicacion:
        'Entrena tu mente para mantener el enfoque en tareas específicas.',
    },
    {
      src: 'https://img.freepik.com/free-vector/hand-drawn-vowels-illustration_23-2150138549.jpg?t=st=1741625323~exp=1741628923~hmac=f4db7a049bb57e1db623e59f9608e3852af19916498a9e3d3623b8906151296b&w=900',
      nombre: 'Lenguaje',
      explicacion: 'Fortalece tu vocabulario y habilidades de comunicación.',
    },
    // {
    //   src: 'https://img.freepik.com/free-vector/curiosity-brain-concept-illustration_114360-11037.jpg?t=st=1741787039~exp=1741790639~hmac=60486d2c309e2a2bcd657c4d138907cd66903094d5affea641a4047b066d67a2&w=900',
    //   nombre: 'Razonamiento',
    //   explicacion:
    //     'Desarrolla tu capacidad para resolver problemas de manera lógica.',
    // },
    // {
    //   src: 'assets/percepcion-icon.png',
    //   nombre: 'Percepción',
    //   explicacion: 'Mejora tu interpretación visual y espacial.',
    // },
    // {
    //   src: 'assets/funciones-icon.png',
    //   nombre: 'Funciones Ejecutivas',
    //   explicacion: 'Optimiza tu planificación y toma de decisiones.',
    // },
  ];

  constructor(
    private ejercicioService: EjercicioPersonaService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['_pacienteData'] && this._pacienteData) {
      this.obtenerCategoriaRecomendada();
    }
  }

  // obtenerCategoriaRecomendada(): void {
  //   console.log('INGRESA AQUI?');
  //   console.log('INGRESA AQUI?');
  //   console.log(this._pacienteData[0].id_paciente);

  //   const paciente = this._pacienteData[0];

  //   const userData = {
  //     id_paciente: paciente.id_paciente,
  //     presion_arterial: {
  //       sistolica: paciente.presion_arterial.sistolica,
  //       diastolica: paciente.presion_arterial.diastolica,
  //     },
  //     frecuencia_cardiaca: paciente.frecuencia_cardiaca,
  //     frecuencia_respiratoria: paciente.frecuencia_respiratoria,
  //     temperatura: paciente.temperatura,
  //   };
  //   this.isLoading = true;

  //   console.log('Datos del usuario:', userData);

  //   this.ejercicioService.getSelectCategoria(userData).subscribe({
  //     next: (response) => {
  //       console.log('Respuesta del servicio:', response);
  //       this.descripcionServicio = response.descripcion; // Guardar la descripción
  //       this.filtrarCategorias(response.categoria); // Filtrar categorías
  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener la categoría:', error);
  //       this.isLoading = false;
  //     },
  //   });
  // }

  filtrarCategorias(categoriasServicio: string[]): void {
    this.categoriasFiltradas = this.categorias.filter((categoria) =>
      categoriasServicio.includes(categoria.nombre)
    );
  }

  seleccionarCategoria(categoria: string): void {
    // this._pacienteData = {
    //   id_paciente: 12345,
    //   nombre: 'Jacob Fabio',
    //   apellido: 'Marzo Silva',
    //   presion_arterial: {
    //     sistolica: 120,
    //     diastolica: 80,
    //   },
    //   frecuencia_cardiaca: 75,
    //   frecuencia_respiratoria: 18,
    //   temperatura: 36.5,
    // };

    this._pacienteCategoria = {
      ...this._pacienteData,
      categoria: categoria,
    };
    this.statusModal = true;
  }

  cerrarModal() {
    this.statusModal = false;
  }

  toggleInfo(): void {
    this.showInfo = !this.showInfo;
  }

  obtenerCategoriaRecomendada(): void {
    const paciente = this._pacienteData[0];
    const userData = {
      id_paciente: paciente.id_paciente,
      presion_arterial: {
        sistolica: paciente.presion_arterial.sistolica,
        diastolica: paciente.presion_arterial.diastolica,
      },
      frecuencia_cardiaca: paciente.frecuencia_cardiaca,
      frecuencia_respiratoria: paciente.frecuencia_respiratoria,
      temperatura: paciente.temperatura,
    };
    this.isLoading = true;

    this.ejercicioService.getSelectCategoria(userData).subscribe({
      next: (response) => {
        this.descripcionServicio = response.descripcion;

        // Procesar recomendaciones IA
        this.categoriasRecomendadasIA = this.categorias
          .filter((categoria) => response.categoria.includes(categoria.nombre))
          .map((categoria) => ({
            ...categoria,
            razon:
              this.razonesRecomendacion[categoria.nombre] ||
              'Recomendado por nuestro sistema',
          }));

        this.filtrarCategorias(response.categoria);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener la categoría:', error);
        this.isLoading = false;
      },
    });
  }

  cambiarModo(modo: 'ia' | 'manual'): void {
    this.modoSeleccion = modo;
  }
}
