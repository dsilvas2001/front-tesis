import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EjercicioGeneradoService } from '../../../../../../core/cuidador/ejercicio-generado/ejercicio-generado.service';

@Component({
  selector: 'app-ejercicio-resultados',
  templateUrl: './ejercicio-resultados.component.html',
  styles: ``,
  standalone: false,
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
    // Intentar recuperar datos del localStorage primero
    const savedData = localStorage.getItem('ejercicioResultados');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.cargarDatos(parsedData);
      this.obtenerRecomendaciones();
    } else {
      // Si no hay datos guardados, intentar obtener del estado de navegación
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.cargarDatos(navigation.extras.state);
        // Guardar en localStorage para futuras recargas
        localStorage.setItem(
          'ejercicioResultados',
          JSON.stringify(navigation.extras.state)
        );
        this.obtenerRecomendaciones();
      } else {
        // No hay datos disponibles, redirigir o manejar el caso
        this.router.navigate(['/ruta-de-fallback']);
      }
    }
  }

  private cargarDatos(datos: any): void {
    this.totalErrores = datos['totalErrores'];
    this.erroresPorPregunta = datos['erroresPorPregunta'];
    this.tiempoTranscurrido = datos['tiempoTranscurrido'];
    this.totalPreguntas = datos['totalPreguntas'];
    this.porcentajeExito = this.calcularPorcentajeExito(
      this.totalPreguntas,
      this.totalErrores
    );
  }

  // private calcularPorcentajeExito(
  //   totalPreguntas: number,
  //   totalErrores: number
  // ): number {
  //   // Evita división por cero
  //   if (totalPreguntas <= 0) return 0;

  //   // Calcula el porcentaje asegurando que esté entre 0% y 100%
  //   const porcentaje = ((totalPreguntas - totalErrores) / totalPreguntas) * 100;
  //   return Math.max(0, Math.min(100, Math.round(porcentaje)));
  // }

  private calcularPorcentajeExito(
    totalPreguntas: number,
    totalErrores: number
  ): number {
    if (totalPreguntas <= 0) return 0;

    // Asegurar que errores no excedan preguntas (evita porcentajes negativos)
    const erroresAjustados = Math.min(totalErrores, totalPreguntas);

    // Nueva fórmula:
    // - Mínimo 20% si hay al menos 1 acierto (para no desmotivar).
    // - Si todos son errores, sí mostrar 0%.
    const aciertos = totalPreguntas - erroresAjustados;
    let porcentaje = (aciertos / totalPreguntas) * 100;

    // Ajuste para adultos mayores:
    if (aciertos > 0 && porcentaje < 20) {
      porcentaje = 20; // Puntaje mínimo de consolación
    }

    return Math.round(porcentaje);
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
  limpiarDatosAlmacenados(): void {
    localStorage.removeItem('ejercicioResultados');
    console.log('Datos de ejercicioResultados eliminados del localStorage.');
  }
}
