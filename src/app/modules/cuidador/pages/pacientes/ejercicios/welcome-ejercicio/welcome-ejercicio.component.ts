import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Ejercicio {
  titulo: string;
  descripcion: string;
  instrucciones: string;
  contenido: {
    contenido: string;
    opciones: { texto: string; imagen: string; loaded?: boolean }[];
    respuesta_correcta: string[];
  };
}

@Component({
  selector: 'app-welcome-ejercicio',
  templateUrl: './welcome-ejercicio.component.html',
  styles: ``,
})
export class WelcomeEjercicioComponent {
  ejercicios: Ejercicio[] = [];

  mensaje: string = '¡Bienvenido a los Ejercicios Cognitivos!';
  descripcion: string =
    'Explora y comienza a ejercitar tu mente con nuestros ejercicios diseñados para potenciar tus habilidades cognitivas.';

  // Estado de carga
  imagenesCargadas = 0;
  totalImagenes = 0;
  cargaCompleta = false;
  errorCarga = false;
  tiempoMaximoEspera = 30000; // 30 segundos
  timeout: any;

  constructor(private router: Router) {}

  precargarImagenes(): void {
    // Calcular total de imágenes
    this.totalImagenes = this.ejercicios.reduce(
      (acc, curr) => acc + curr.contenido.opciones.length,
      0
    );

    // Iniciar timeout para manejar carga lenta
    this.timeout = setTimeout(() => {
      if (!this.cargaCompleta) {
        this.errorCarga = true;
        console.warn(
          'Tiempo de carga excedido. Continuando con carga parcial...'
        );
        this.verificarCargaCompleta();
      }
    }, this.tiempoMaximoEspera);

    // Precargar cada imagen
    this.ejercicios.forEach((ejercicio) => {
      ejercicio.contenido.opciones.forEach((opcion) => {
        console.log('Cargando imagen:', opcion.imagen); // Log para verificar las URLs
        const img = new Image();
        img.src = opcion.imagen;

        img.onload = () => {
          console.log('Imagen cargada:', opcion.imagen); // Log para confirmar que la imagen se cargó
          this.imagenesCargadas++;
          opcion.loaded = true;
          this.verificarCargaCompleta();
        };

        img.onerror = () => {
          console.error(`Error cargando imagen: ${opcion.imagen}`); // Log para identificar errores
          this.imagenesCargadas++;
          this.errorCarga = true;
          this.verificarCargaCompleta();
        };
      });
    });
  }

  verificarCargaCompleta(): void {
    if (this.imagenesCargadas === this.totalImagenes) {
      this.cargaCompleta = true;
      this.errorCarga = false; // Asegurarnos de que errorCarga sea false
      clearTimeout(this.timeout); // Limpiar el timeout si la carga se completa
      console.log('Todas las imágenes se cargaron correctamente.');
    } else if (this.errorCarga) {
      this.cargaCompleta = false; // Asegurarnos de que cargaCompleta sea false
      console.warn('Algunas imágenes no se cargaron correctamente.');
    }
  }

  get progresoCarga(): number {
    return this.totalImagenes > 0
      ? Math.round((this.imagenesCargadas / this.totalImagenes) * 100)
      : 0;
  }

  iniciarEjercicio(): void {
    if (this.cargaCompleta || this.errorCarga) {
      this.navegarDirectamente();
    } else {
      console.warn(
        'La carga aún no ha finalizado. Intenta nuevamente en unos segundos.'
      );
    }
  }

  private navegarDirectamente(): void {
    this.router.navigate(['/Cuidador/ejercicios/ejercicio-multiple'], {
      state: { ejercicios: this.ejercicios },
    });
  }

  ngOnInit(): void {
    if (history.state.ejercicios) {
      this.ejercicios = history.state.ejercicios;
      this.precargarImagenes();
    } else {
      this.router.navigate(['/Cuidador/ejercicios']);
    }
  }
}
