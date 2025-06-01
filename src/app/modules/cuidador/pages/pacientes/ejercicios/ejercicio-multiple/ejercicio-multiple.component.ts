import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EjercicioGeneradoService } from '../../../../../../core/cuidador/ejercicio-generado/ejercicio-generado.service';

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
  standalone: false,
})
export class EjercicioMultipleComponent {
  ejercicios: Ejercicio[] = [];
  _pacienteGenerate: any;
  ejercicioActualIndex: number = 0;
  respuestaSeleccionada: string | null = null;
  respuestaCorrectaSeleccionada = false;

  feedback: string = '';
  tiempoTranscurrido: number = 0;
  intervalo: any;
  erroresPorPregunta: number[] = [];
  totalErrores: number = 0;

  // text to Speech
  private synth = window.speechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  isSpeaking = false;

  constructor(
    private router: Router,
    private ejercicioGeneradoService: EjercicioGeneradoService
  ) {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech no está soportado en este navegador');
    }
  }

  ngOnInit(): void {
    if (history.state.ejercicios) {
      this.ejercicios = history.state.ejercicios;
      this._pacienteGenerate = history.state.paciente;
      this.inicializarImagenes();
      this.iniciarCronometro();
      this.preloadImages(0);
      // Lee automáticamente el primer ejercicio
      setTimeout(() => this.leerEjercicioActual(), 1000);
    } else {
      this.router.navigate(['/Cuidador/ejercicios']);
    }
  }
  // texto to speech
  leerEjercicioActual(): void {
    this.detenerLectura();

    const ejercicio = this.ejercicios[this.ejercicioActualIndex];
    const texto = `${ejercicio.titulo}. ${ejercicio.descripcion}. ${ejercicio.contenido.contenido}`;

    this.utterance = new SpeechSynthesisUtterance(texto);
    this.utterance.lang = 'es-ES'; // Configura el idioma
    this.utterance.rate = 1.0; // Velocidad de habla

    this.utterance.onend = () => {
      this.isSpeaking = false;
    };

    this.synth.speak(this.utterance);
    this.isSpeaking = true;
  }

  // leerOpcion(opcion: string): void {
  //   this.detenerLectura();

  //   this.utterance = new SpeechSynthesisUtterance(opcion);
  //   this.utterance.lang = 'es-ES';
  //   this.utterance.rate = 1.0;

  //   this.synth.speak(this.utterance);
  //   this.isSpeaking = true;
  // }

  leerOpcion(texto: string): void {
    this.detenerLectura();

    // Verifica que el texto no esté vacío
    if (!texto || texto.trim() === '') {
      console.warn('Texto vacío para leer');
      return;
    }

    // Crea una nueva instancia cada vez
    this.utterance = new SpeechSynthesisUtterance(texto);
    this.utterance.lang = 'es-ES';
    this.utterance.rate = 1.0;

    // Configura eventos para manejar errores
    this.utterance.onerror = (event) => {
      console.error('Error en TTS:', event);
      this.isSpeaking = false;
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
    };

    // Intenta leer el texto
    try {
      this.synth.speak(this.utterance);
      this.isSpeaking = true;
    } catch (error) {
      console.error('Error al reproducir:', error);
      this.isSpeaking = false;
    }
  }

  detenerLectura(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  toggleLectura(): void {
    if (this.isSpeaking) {
      this.detenerLectura();
    } else {
      this.leerEjercicioActual();
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

  // seleccionarRespuesta(opcion: string): void {
  //   if (this.respuestaCorrectaSeleccionada) return; // Evita cambios después de acertar

  //   const respuestaCorrecta =
  //     this.ejercicios[this.ejercicioActualIndex].contenido
  //       .respuesta_correcta[0];

  //   this.respuestaSeleccionada = opcion;

  //   if (opcion !== respuestaCorrecta) {
  //     this.erroresPorPregunta[this.ejercicioActualIndex] =
  //       (this.erroresPorPregunta[this.ejercicioActualIndex] || 0) + 1;
  //     this.totalErrores++;
  //     this.feedback = '❌ Incorrecto, intenta de nuevo.';
  //   } else {
  //     this.feedback = '✅ ¡Correcto! Puedes continuar.';
  //     this.respuestaCorrectaSeleccionada = true;
  //   }
  // }

  seleccionarRespuesta(opcion: string): void {
    if (this.respuestaCorrectaSeleccionada) return;

    const respuestaCorrecta =
      this.ejercicios[this.ejercicioActualIndex].contenido
        .respuesta_correcta[0];
    this.respuestaSeleccionada = opcion;

    if (opcion !== respuestaCorrecta) {
      this.erroresPorPregunta[this.ejercicioActualIndex] =
        (this.erroresPorPregunta[this.ejercicioActualIndex] || 0) + 1;
      this.totalErrores++;
      this.feedback = '❌ Incorrecto, intenta de nuevo.';
      this.leerFeedback('Incorrecto. Por favor, intenta de nuevo.'); // Mensaje más claro para TTS
    } else {
      this.feedback = '✅ ¡Correcto! Puedes continuar.';
      this.respuestaCorrectaSeleccionada = true;
      this.leerFeedback('¡Correcto! Muy bien hecho. Puedes continuar.'); // Mensaje positivo
    }
  }

  leerFeedback(texto: string): void {
    this.detenerLectura();

    this.utterance = new SpeechSynthesisUtterance(texto);
    this.utterance.lang = 'es-ES';
    this.utterance.rate = 1.0;

    // Configura una voz femenina para el feedback si está disponible
    const voices = this.synth.getVoices();
    const femaleVoice = voices.find(
      (v) => v.lang.includes('es') && v.name.includes('Female')
    );
    if (femaleVoice) {
      this.utterance.voice = femaleVoice;
    }

    this.synth.speak(this.utterance);
  }

  // siguienteEjercicio(): void {
  //   if (this.ejercicioActualIndex < this.ejercicios.length - 1) {
  //     this.preloadImages(this.ejercicioActualIndex + 1); // Precarga siguiente
  //     this.ejercicioActualIndex++;
  //     this.respuestaSeleccionada = null; // Reinicia la selección
  //     this.respuestaCorrectaSeleccionada = false; // Reinicia el estado
  //     this.feedback = ''; // Reinicia el feedback
  //   } else {
  //     this.navegarResultados();
  //   }
  // }

  siguienteEjercicio(): void {
    this.detenerLectura();

    if (this.ejercicioActualIndex < this.ejercicios.length - 1) {
      this.preloadImages(this.ejercicioActualIndex + 1);
      this.ejercicioActualIndex++;
      this.respuestaSeleccionada = null;
      this.respuestaCorrectaSeleccionada = false;
      this.feedback = '';
      // Lee automáticamente el nuevo ejercicio
      setTimeout(() => this.leerEjercicioActual(), 500);
    } else {
      console.log('_pacienteGenerate');
      console.log(this._pacienteGenerate);

      const tiempoTotalSegundos = Math.round(this.tiempoTranscurrido / 1000);

      const resultadoFinal = {
        paciente: {
          // <-- Solo agregué este objeto con los datos del paciente
          id_paciente: this._pacienteGenerate.id_paciente,
          nombre: this._pacienteGenerate.nombre,
          apellido: this._pacienteGenerate.apellido,
          edad: this._pacienteGenerate.edad,
        },
        ejercicios: this.ejercicios.map((ejercicio, index) => ({
          ...ejercicio, // Incluye todos los campos originales del ejercicio
          resultado: {
            intentos: (this.erroresPorPregunta[index] || 0) + 1,
            errores: this.erroresPorPregunta[index] || 0,
          },
        })),
        resumen: {
          total_ejercicios: this.ejercicios.length,
          ejercicios_correctos: this.erroresPorPregunta.filter((e) => e === 0)
            .length,
          total_errores: this.totalErrores,
          tiempo_total_segundos: tiempoTotalSegundos,
          tiempo_total_minutos: +(tiempoTotalSegundos / 60).toFixed(2),
          tiempo_total_formateado: this.formatearTiempo(tiempoTotalSegundos),
        },
      };

      console.log(
        'Resultado completo:',
        JSON.stringify(resultadoFinal, null, 2)
      );

      this.ejercicioGeneradoService
        .registerEjercicio(resultadoFinal)
        .subscribe({
          next: (response) => {
            console.log('Resultados enviados exitosamente:', response);
            this.navegarResultados();
          },
          error: (error) => {
            console.error('Error al enviar resultados:', error);

            this.navegarResultados();
          },
        });
    }
  }
  private formatearTiempo(segundos: number): string {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return mins > 0 ? `${mins} min ${secs} seg` : `${secs} segundos`;
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
