import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Ejercicio {
  titulo: string;
  descripcion: string;
  instrucciones: string;
  contenido: {
    contenido: string;
    opciones: {
      loaded: boolean;
      texto: string;
      imagen: string;
    }[];
    respuesta_correcta: string[];
  };
}

@Component({
  selector: 'app-ejercicio-multiple',
  templateUrl: './ejercicio-multiple.component.html',
  styles: ``,
})
export class EjercicioMultipleComponent {
  ejercicios: Ejercicio[] = [];
  ejercicioActualIndex: number = 0;
  respuestaSeleccionada: string | null = null;
  respuestaCorrectaSeleccionada = false;

  feedback: string = '';
  tiempoTranscurrido: number = 0;
  intervalo: any;
  erroresPorPregunta: number[] = [];
  totalErrores: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (history.state.ejercicios) {
      this.ejercicios = history.state.ejercicios;
      this.inicializarImagenes();
      this.iniciarCronometro();
      this.preloadImages(0); // Precarga inicial
    } else {
      this.router.navigate(['/Cuidador/ejercicios']);
    }
  }

  private inicializarImagenes(): void {
    this.ejercicios.forEach((ejercicio) => {
      ejercicio.contenido.opciones.forEach((opcion) => {
        opcion.loaded = false;
      });
    });
  }

  private preloadImages(index: number): void {
    // Precarga imágenes del ejercicio actual y siguiente
    [index, index + 1].forEach((i) => {
      if (i < this.ejercicios.length) {
        this.ejercicios[i].contenido.opciones.forEach((opcion) => {
          const img = new Image();
          img.src = opcion.imagen;
          img.onload = () => (opcion.loaded = true);
        });
      }
    });
  }

  onImageLoad(opcion: any): void {
    opcion.loaded = true;
  }

  iniciarCronometro(): void {
    this.intervalo = setInterval(() => {
      this.tiempoTranscurrido += 1000;
    }, 1000);
  }

  seleccionarRespuesta(opcion: string): void {
    if (this.respuestaCorrectaSeleccionada) return; // Evita cambios después de acertar

    const respuestaCorrecta =
      this.ejercicios[this.ejercicioActualIndex].contenido
        .respuesta_correcta[0];

    this.respuestaSeleccionada = opcion;

    if (opcion !== respuestaCorrecta) {
      this.erroresPorPregunta[this.ejercicioActualIndex] =
        (this.erroresPorPregunta[this.ejercicioActualIndex] || 0) + 1;
      this.totalErrores++;
      this.feedback = '❌ Incorrecto, intenta de nuevo.';
    } else {
      this.feedback = '✅ ¡Correcto! Puedes continuar.';
      this.respuestaCorrectaSeleccionada = true;
    }
  }

  siguienteEjercicio(): void {
    if (this.ejercicioActualIndex < this.ejercicios.length - 1) {
      this.preloadImages(this.ejercicioActualIndex + 1); // Precarga siguiente
      this.ejercicioActualIndex++;
      this.respuestaSeleccionada = null; // Reinicia la selección
      this.respuestaCorrectaSeleccionada = false; // Reinicia el estado
      this.feedback = ''; // Reinicia el feedback
    } else {
      this.navegarResultados();
    }
  }

  private navegarResultados(): void {
    this.router.navigate(['/Cuidador/ejercicios/ejercicio-resultados'], {
      state: {
        totalErrores: this.totalErrores,
        erroresPorPregunta: this.erroresPorPregunta,
        tiempoTranscurrido: this.tiempoTranscurrido,
        totalPreguntas: this.ejercicios.length,
      },
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }
}
