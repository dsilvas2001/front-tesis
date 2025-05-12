import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EjercicioGeneradoService } from '../../../../../../core/cuidador/ejercicio-generado/ejercicio-generado.service';

@Component({
  selector: 'app-ejercicio-resultados',
  templateUrl: './ejercicio-resultados.component.html',
  styles: ``,
})
export class EjercicioResultadosComponent {
  totalErrores: number = 0;
  erroresPorPregunta: any;
  tiempoTranscurrido: number = 0;
  totalPreguntas: number = 0;
  porcentajeExito: number = 0;
  isLoading: boolean = true; // Nuevo estado para controlar el loading

  aiFeedback = {
    tendencia: '',
    recomendaciones: [] as string[],
    fortalezas: [] as string[],
  };

  constructor(
    private router: Router,
    private ejercicioGeneradoService: EjercicioGeneradoService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.totalErrores = navigation.extras.state['totalErrores'];
      this.erroresPorPregunta = navigation.extras.state['erroresPorPregunta'];
      this.tiempoTranscurrido = navigation.extras.state['tiempoTranscurrido'];
      this.totalPreguntas = navigation.extras.state['totalPreguntas'];
      this.porcentajeExito = Math.round(
        ((this.totalPreguntas - this.totalErrores) / this.totalPreguntas) * 100
      );
      this.obtenerRecomendaciones();
    }
  }

  obtenerRecomendaciones(): void {
    // Crear la tendencia como una cadena concatenada
    const tendencia = `Total de errores: ${
      this.totalErrores
    }, Errores por pregunta: ${JSON.stringify(
      this.erroresPorPregunta
    )}, Tiempo transcurrido: ${
      this.tiempoTranscurrido
    } segundos, Total de preguntas: ${this.totalPreguntas}`;

    // Crear el cuerpo de la solicitud
    const body = {
      tendencia,
      porcentajeExito: this.porcentajeExito,
      tiempoTranscurrido: this.tiempoTranscurrido,
    };

    // Llamar al servicio para obtener recomendaciones
    this.ejercicioGeneradoService.getRecomendaciones(body).subscribe(
      (response) => {
        // Asignar la respuesta del backend a aiFeedback
        this.aiFeedback = response;
        this.isLoading = false; // Desactivar loading al recibir respuesta
      },
      (error) => {
        console.error('Error al obtener recomendaciones:', error);
        // En caso de error, usar valores por defecto
        this.aiFeedback = {
          tendencia: 'No se pudo obtener la tendencia de errores.',
          recomendaciones: [
            'Revisa la sección de ejercicios para mejorar.',
            'Intenta el modo "Contrarreloj" para mejorar tu velocidad.',
          ],
          fortalezas: ['Persistencia', 'Esfuerzo'],
        };
        this.isLoading = false; // Desactivar loading al recibir respuesta
      }
    );
  }
}
