import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EjercicioGeneradoService } from '../../../../core/cuidador/ejercicio-generado/ejercicio-generado.service';

@Component({
  selector: 'app-ejercicio-realizado-modal',
  standalone: false,
  templateUrl: './ejercicio-realizado-modal.component.html',
  styles: ``,
})
export class EjercicioRealizadoModalComponent implements OnInit {
  @Input() idPaciente: string = '';
  @Output() close = new EventEmitter<void>();

  isLoading: boolean = false;
  ejerciciosRealizados: any[] = [];

  constructor(private ejercicioGeneradoService: EjercicioGeneradoService) {}

  ngOnInit(): void {
    this.loadEjercicios();
  }

  loadEjercicios(): void {
    this.isLoading = true;
    this.ejercicioGeneradoService
      .getEjercicioResultado(this.idPaciente)
      .subscribe({
        next: (data) => {
          this.ejerciciosRealizados = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar ejercicios:', error);
          this.isLoading = false;
        },
      });
  }

  closeModal(): void {
    this.close.emit();
  }
}
