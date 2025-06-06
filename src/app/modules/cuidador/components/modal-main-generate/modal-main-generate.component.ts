import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EjercicioGeneradoService } from '../../../../core/cuidador/ejercicio-generado/ejercicio-generado.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-modal-main-generate',
  templateUrl: './modal-main-generate.component.html',
  styles: ``,
  standalone: false,
})
export class ModalMainGenerateComponent implements OnInit, OnChanges {
  @Input() _pacienteGenerate: any;
  nombrePaciente: string = 'PEDRO';
  cantidadEjercicios: number = 0; // Variable para almacenar el número de ejercicios
  isLoading: boolean = false; // Variable para controlar el estado de carga

  @Output() cerrarModal = new EventEmitter<void>(); // Emite un evento para cerrar el modal
  @ViewChild('carrusel', { static: false }) carrusel!: ElementRef;

  ejerciciosGenerados: any[] = []; // Almacena los ejercicios generados

  mostrarPrevisualizacion: boolean = false;

  // VALIDAR
  ejerciciosValidados: boolean = false;

  categorias = [
    {
      src: '../../../../../assets/images/ejercicio/Generar_ejercicio_memoria.webp',
      nombre: 'Memoria',
    },
    {
      src: 'https://img.freepik.com/free-photo/lonely-woman-confronting-alzheimer-disease_23-2149043761.jpg?t=st=1741625290~exp=1741628890~hmac=bf27b52da86b074771876011bd9e150ccbc82b1cb00b2c48210d86e1fdc9643f&w=740',
      nombre: 'Atención',
    },
    {
      src: '../../../../../assets/images/ejercicio/Generar_ejercicio_lenguaje.webp',
      nombre: 'Lenguaje',
    },
    {
      src: 'https://img.freepik.com/free-vector/curiosity-brain-concept-illustration_114360-11037.jpg?t=st=1741787039~exp=1741790639~hmac=60486d2c309e2a2bcd657c4d138907cd66903094d5affea641a4047b066d67a2&w=900',
      nombre: 'Razonamiento',
    },
  ];

  randomImages: string[] = [
    '../../../../../assets/images/item-ejercicio-generado/ejercicio1.png',
    '../../../../../assets/images/item-ejercicio-generado/ejercicio2.png',
    '../../../../../assets/images/item-ejercicio-generado/ejercicio3.jpg',
    '../../../../../assets/images/item-ejercicio-generado/ejercicio4.png',
  ];

  constructor(
    private router: Router,
    private ejercicioGeneradoService: EjercicioGeneradoService
  ) {}

  // onEjerciciosValidados(validados: boolean): void {
  //   this.ejerciciosValidados = validados;
  // }

  onEjerciciosValidados(validados: boolean): void {
    this.ejerciciosValidados = validados;

    // Opcional: Actualizar estado en el padre si es necesario
    if (validados) {
      this.ejerciciosGenerados = this.ejerciciosGenerados.map((e) => ({
        ...e,
        estado: 'aprobado',
      }));
    }
  }

  // Opcional: Método para forzar validación
  validarEjercicios(): void {
    // Si necesitas llamar manualmente la validación
  }

  categoriaSeleccionada() {
    return this.categorias.find(
      (cat) => cat.nombre === this._pacienteGenerate.categoria
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._pacienteGenerate && this._pacienteGenerate.categoria) {
      this.categoriaSeleccionada();
    }
  }
  // Método para obtener una imagen aleatoria
  getRandomImage(index: number): string {
    return this.randomImages[index % this.randomImages.length];
  }

  generarEjercicios(): void {
    if (this.cantidadEjercicios <= 0) {
      alert('El número de ejercicios debe ser mayor que cero.');
      return;
    }

    this.isLoading = true; // Activar el estado de carga
    const userData = {
      id_paciente: this._pacienteGenerate[0].id_paciente,
      presion_arterial: {
        sistolica: this._pacienteGenerate[0].presion_arterial.sistolica,
        diastolica: this._pacienteGenerate[0].presion_arterial.diastolica,
      },
      frecuencia_cardiaca: this._pacienteGenerate[0].frecuencia_cardiaca,
      frecuencia_respiratoria:
        this._pacienteGenerate[0].frecuencia_respiratoria,
      temperatura: this._pacienteGenerate[0].temperatura,
    };

    this.ejercicioGeneradoService
      .getEjercicioGenerado(
        this._pacienteGenerate.categoria,
        this.cantidadEjercicios,
        userData
      )
      .subscribe({
        next: (response) => {
          console.log('Respuesta al generar ejercicio:', response);

          this.ejerciciosGenerados = response; // Asignar la respuesta a ejerciciosGenerados
          this.isLoading = false; // Desactivar el estado de carga
        },
        error: (error) => {
          console.error('Error al obtener la categoría:', error);
          this.isLoading = false;
        },
      });
  }

  ngOnInit(): void {
    console.log('tituloModal');
    console.log('this._pacienteGenerate', this._pacienteGenerate);
  }

  // Método para cerrar el modal
  onCerrarModal(): void {
    this.cerrarModal.emit();
  }

  iniciarEjercicio(): void {
    this.router.navigate(['/Cuidador/ejercicios/welcome'], {
      state: {
        ejercicios: this.ejerciciosGenerados,
        paciente: {
          id_paciente: this._pacienteGenerate[0].id_paciente,
          nombre: this._pacienteGenerate[0].nombre,
          apellido: this._pacienteGenerate[0].apellido,
          edad: this._pacienteGenerate[0].edad,
          // Puedes añadir más campos si son necesarios
          genero: this._pacienteGenerate[0].genero,
        },
      },
    });
  }

  abrirPrevisualizacion() {
    this.mostrarPrevisualizacion = true;
  }
  cerrarPrevisualizacion() {
    this.mostrarPrevisualizacion = false;
  }

  // carrucel
  scrollCarrusel(direction: 'left' | 'right') {
    const element = this.carrusel.nativeElement;
    const scrollAmount = 320; // ancho de cada card + margen
    element.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }
}
