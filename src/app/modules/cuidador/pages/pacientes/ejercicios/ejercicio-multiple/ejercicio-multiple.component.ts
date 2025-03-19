import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Ejercicio {
  titulo: string;
  descripcion: string;
  instrucciones: string;
  contenido: {
    contenido: string;
    opciones: { texto: string; imagen: string }[];
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
  feedback: string = '';
  tiempoTranscurrido: number = 0;

  constructor(private router: Router) {}

  intervalo: any;

  iniciarCronometro() {
    this.intervalo = setInterval(() => {
      this.tiempoTranscurrido += 1000;
    }, 1000);
  }

  erroresPorPregunta: number[] = [];
  totalErrores: number = 0;

  ngOnDestroy() {
    clearInterval(this.intervalo);
  }

  ngOnInit(): void {
    if (history.state.ejercicios) {
      this.ejercicios = history.state.ejercicios;
      this.iniciarCronometro();
    } else {
      this.router.navigate(['/Cuidador/ejercicios']);
    }
  }

  seleccionarRespuesta(opcion: string): void {
    this.respuestaSeleccionada = opcion;
    const respuestaCorrecta =
      this.ejercicios[this.ejercicioActualIndex].contenido
        .respuesta_correcta[0];

    if (opcion !== respuestaCorrecta) {
      if (!this.erroresPorPregunta[this.ejercicioActualIndex]) {
        this.erroresPorPregunta[this.ejercicioActualIndex] = 0;
      }
      this.erroresPorPregunta[this.ejercicioActualIndex]++;
      this.totalErrores++;
    }

    this.feedback =
      opcion === respuestaCorrecta
        ? '✅ ¡Correcto!'
        : '❌ Incorrecto, intenta de nuevo.';
  }

  siguienteEjercicio(): void {
    if (this.ejercicioActualIndex < this.ejercicios.length - 1) {
      this.ejercicioActualIndex++;
      this.respuestaSeleccionada = null;
      this.feedback = '';
    } else {
      this.router.navigate(['/Cuidador/ejercicios/ejercicio-resultados'], {
        state: {
          totalErrores: this.totalErrores,
          erroresPorPregunta: this.erroresPorPregunta,
          tiempoTranscurrido: this.tiempoTranscurrido,
          totalPreguntas: this.ejercicios.length,
        },
      });
    }
  }
}
