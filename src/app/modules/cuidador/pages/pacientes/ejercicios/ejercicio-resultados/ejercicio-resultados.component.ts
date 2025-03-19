import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.totalErrores = navigation.extras.state['totalErrores'];
      this.erroresPorPregunta = navigation.extras.state['erroresPorPregunta'];
      this.tiempoTranscurrido = navigation.extras.state['tiempoTranscurrido'];
      this.totalPreguntas = navigation.extras.state['totalPreguntas'];
      this.porcentajeExito = Math.round(
        ((this.totalPreguntas - this.totalErrores) / this.totalPreguntas) * 100
      );
    }
  }
  aiFeedback = {
    tendencia:
      'Notamos que tienes mayor dificultad con preguntas relacionadas a memoria a corto plazo...',
    recomendaciones: [
      'Practica ejercicios de asociación visual 10 minutos al día',
      'Intenta el modo "Contrarreloj" para mejorar tu velocidad',
      'Revisa la sección de concentración en nuestra biblioteca',
    ],
    fortalezas: [
      'Razonamiento lógico',
      'Velocidad de respuesta',
      'Persistencia',
    ],
  };
}
