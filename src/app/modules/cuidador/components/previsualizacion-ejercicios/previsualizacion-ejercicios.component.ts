import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EjercicioGeneradoService } from '../../../../core/cuidador/ejercicio-generado/ejercicio-generado.service';

export interface Ejercicio {
  titulo: string;
  descripcion: string;
  instrucciones: string;
  dificultad: string;
  estado?: 'pendiente' | 'aprobado' | 'rechazado';

  contenido: {
    contenido: string;
    opciones?: {
      texto: string;
      imagen: string;
    }[];
    respuesta_correcta?: string[];
    tipo_contenido: string;
  };

  // ✅ Propiedades agregadas para validación

  calidad?: number;
  ajustesNecesarios?: 'ninguno' | 'menores' | 'importantes' | 'rediseñar';
  notasValidacion?: string;
}

export interface Paciente {
  nombre: string;
  apellido: string;
  edad?: number;
  genero?: string;
  foto?: string;
}

@Component({
  selector: 'app-previsualizacion-ejercicios',
  standalone: false,
  templateUrl: './previsualizacion-ejercicios.component.html',
  styles: ``,
})
export class PrevisualizacionEjerciciosComponent implements OnChanges {
  statusModal = false;
  activeIndex: number | null = null;
  selectedIndex: number | null = null;

  showImageModal = false;
  isLoadingImage = false;
  searchTerm = '';
  opcionSeleccionada: number | null = null;

  copiasTemporales: Record<
    number,
    Partial<{ descripcion: string; instrucciones: string; contenido: string }>
  > = {};

  @Output() closeModalEvent = new EventEmitter<void>();
  @Input() ejercicios: Ejercicio[] = [];
  @Input() paciente: any;
  //VALIDAR EJERCICIO
  @Output() ejerciciosValidados = new EventEmitter<boolean>();
  ejerciciosAprobados: boolean = false;

  editingStates: Record<number, Record<string, boolean>> = {};

  // Añade estas propiedades a tu componente
  motivoRechazo: string = '';
  explicacionRechazo: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private ejercicioGeneradoService: EjercicioGeneradoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ejercicios']) {
      this.copiasTemporales = {}; // limpiar para evitar acumulación innecesaria
      this.editingStates = {};
    }
  }

  // VALIDAR
  validarEjercicios(): void {
    // Lógica de validación - ejemplo básico (debes adaptarla)
    const todosValidados = this.ejercicios.every(
      (ejercicio) =>
        ejercicio.ajustesNecesarios === 'ninguno' ||
        ejercicio.ajustesNecesarios === undefined
    );

    this.ejerciciosAprobados = todosValidados;
    this.ejerciciosValidados.emit(todosValidados);
  }

  closeModal() {
    this.statusModal = false;
    this.closeModalEvent.emit();
  }

  getDificultadClass(dificultad: string): string {
    const map: Record<string, string> = {
      baja: 'bg-green-100 text-green-800',
      media: 'bg-amber-100 text-amber-800',
      alta: 'bg-red-100 text-red-800',
    };
    return map[dificultad.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  saveEdit(field: string, index: number) {
    this.editingStates[index][field] = false;
  }

  getRatingText(rating: number): string {
    const texts = [
      'Muy pobre',
      'Pobre',
      'Regular',
      'Bueno',
      'Muy bueno',
      'Excelente',
    ];
    return texts[rating] || '';
  }

  editarCampo(
    campo: 'descripcion' | 'instrucciones' | 'contenido',
    index: number
  ) {
    this.editingStates[index][campo] = false;
    this.copiasTemporales[index][campo] =
      campo === 'contenido'
        ? this.ejercicios[index].contenido.contenido
        : this.ejercicios[index][campo];
  }

  toggleEdit(
    field: 'descripcion' | 'instrucciones' | 'contenido',
    index: number
  ) {
    if (!this.editingStates[index]) this.editingStates[index] = {};
    this.editingStates[index][field] = true;
    if (!this.copiasTemporales[index]) this.copiasTemporales[index] = {};
    this.copiasTemporales[index][field] =
      field === 'contenido'
        ? this.ejercicios[index].contenido.contenido
        : this.ejercicios[index][field];
  }

  cancelEdit(
    campo: 'descripcion' | 'instrucciones' | 'contenido',
    index: number
  ) {
    if (this.copiasTemporales[index]?.[campo] !== undefined) {
      if (campo === 'contenido') {
        this.ejercicios[index].contenido.contenido =
          this.copiasTemporales[index][campo]!;
      } else {
        this.ejercicios[index][campo] = this.copiasTemporales[index][campo]!;
      }
    }
    this.editingStates[index][campo] = false;
  }

  setActive(index: number): void {
    this.activeIndex = index;
  }

  selectItem(index: number): void {
    this.selectedIndex = index;
  }

  trackByOpcion(index: number): number {
    return index;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
    this.cdr.markForCheck();
  }

  hasOpciones(ejercicio: Ejercicio): boolean {
    return (
      Array.isArray(ejercicio?.contenido?.opciones) &&
      ejercicio.contenido.opciones.length > 0
    );
  }

  seleccionarOpcion(index: number) {
    this.opcionSeleccionada = this.opcionSeleccionada === index ? null : index;
  }

  availableImages: string[] = [
    'https://via.placeholder.com/150/FF0000/FFFFFF?text=Rojo',
    'https://via.placeholder.com/150/0000FF/FFFFFF?text=Azul',
    'https://via.placeholder.com/150/00FF00/FFFFFF?text=Verde',
    'https://via.placeholder.com/150/FFFF00/FFFFFF?text=Amarillo',
    'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Magenta',
    'https://via.placeholder.com/150/00FFFF/FFFFFF?text=Cyan',
  ];

  currentEjercicioIndex: number | null = null;
  currentOpcionIndex: number | null = null;
  selectedImage = '';

  openImageModal(ejercicioIndex: number, opcionIndex: number) {
    this.currentEjercicioIndex = ejercicioIndex;
    this.currentOpcionIndex = opcionIndex;
    this.selectedImage = '';
    this.searchTerm = '';
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
  }

  selectImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  confirmImageChange() {
    if (
      this.currentEjercicioIndex !== null &&
      this.currentOpcionIndex !== null &&
      this.selectedImage
    ) {
      this.isLoadingImage = true;

      setTimeout(() => {
        const ejercicio = this.ejercicios[this.currentEjercicioIndex!];
        if (ejercicio.contenido.opciones) {
          ejercicio.contenido.opciones[this.currentOpcionIndex!].imagen =
            this.selectedImage;
        }
        this.isLoadingImage = false;
        this.showImageModal = false;
        alert('¡La imagen fue actualizada correctamente!');
      }, 500); // reducir timeout para mejor respuesta
    }
  }

  // SubirImagen
  imagenSubida: any[][] = [];
  triggerFileInput(i: number, j: number): void {
    const fileInput = document.getElementById(
      `fileInput${i}${j}`
    ) as HTMLInputElement;
    fileInput.value = ''; // Permite reseleccionar el mismo archivo
    fileInput.click();
  }

  // Maneja la subida de la imagen
  handleImageUpload(event: any, i: number, j: number): void {
    const file = event.target.files[0];
    if (file) {
      // Validaciones básicas
      if (!file.type.match('image.*')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB máximo
        alert('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Actualiza la imagen en el array de opciones (usando ejercicios en lugar de ejercicio)
        if (this.ejercicios[i]?.contenido?.opciones) {
          this.ejercicios[i].contenido.opciones[j].imagen = e.target.result;
        }

        // Si necesitas guardar en el backend:
        // this.guardarImagenEnBackend(file, i, j);
      };
      reader.readAsDataURL(file);
    }
  }

  handleEditClick(event: MouseEvent, i: number, j: number) {
    // Detiene TODA la propagación del evento
    event.stopImmediatePropagation();
    event.preventDefault();

    // Llama a la función para abrir el selector de archivos
    this.triggerFileInput(i, j);
  }

  //

  // ESTADO DEL MODAL

  // Agrega estas propiedades a tu clase
  @Output() ejerciciosActualizados = new EventEmitter<Ejercicio[]>();
  @Output() ejercicioRechazado = new EventEmitter<number>(); // Índice del ejercicio rechazado
  showRejectionOptions: number | null = null; // Índice del ejercicio que muestra opciones de rechazo
  customSearchTerm: string = ''; // Cadena de búsqueda personalizada
  isRegenerating: boolean = false; // Estado de regeneración

  // Método para aprobar todos los ejercicios

  // aprobarTodosEjercicios(): void {
  //   this.ejercicios.forEach((ejercicio) => {
  //     ejercicio.ajustesNecesarios = 'ninguno';
  //     ejercicio.calidad = 5; // Máxima calidad
  //     ejercicio.estado = 'aprobado'; // Agrega esta propiedad a tu interfaz Ejercicio
  //   });
  //   this.ejerciciosValidados.emit(true);
  //   this.ejerciciosActualizados.emit(this.ejercicios);
  // }

  // Método para aprobar un ejercicio individual
  // aprobarEjercicio(index: number): void {
  //   this.ejercicios[index].ajustesNecesarios = 'ninguno';
  //   this.ejercicios[index].calidad = 5;
  //   this.ejercicios[index].estado = 'aprobado';

  //   // Verificar si todos están aprobados
  //   const todosAprobados = this.ejercicios.every(
  //     (e) => e.estado === 'aprobado'
  //   );
  //   this.ejerciciosValidados.emit(todosAprobados);
  //   this.ejerciciosActualizados.emit(this.ejercicios);
  // }

  // Método para aprobar todos los ejercicios
  aprobarTodosEjercicios(): void {
    if (!this.ejercicios?.length) return;

    // Aprobar todos los ejercicios
    this.ejercicios.forEach((ejercicio) => {
      ejercicio.ajustesNecesarios = 'ninguno';
      ejercicio.calidad = 5;
      ejercicio.estado = 'aprobado';
    });

    // Emitir eventos
    this.emitirValidacionCompleta();
  }

  // Método para aprobar ejercicio individual
  aprobarEjercicio(index: number): void {
    this.ejercicios[index].ajustesNecesarios = 'ninguno';
    this.ejercicios[index].calidad = 5;
    this.ejercicios[index].estado = 'aprobado';

    // Verificar si todos están aprobados
    this.verificarValidacionCompleta();
  }

  // Método para verificar validación completa
  private verificarValidacionCompleta(): void {
    const todosAprobados = this.ejercicios.every(
      (e) =>
        e.estado === 'aprobado' &&
        e.ajustesNecesarios === 'ninguno' &&
        typeof e.calidad === 'number' &&
        e.calidad >= 4
    );

    this.ejerciciosValidados.emit(todosAprobados);
    this.ejerciciosActualizados.emit([...this.ejercicios]);
  }

  // Método para emitir validación completa
  private emitirValidacionCompleta(): void {
    this.ejerciciosValidados.emit(true);
    this.ejerciciosActualizados.emit([...this.ejercicios]);
  }

  // Método para rechazar un ejercicio
  rechazarEjercicio(index: number, regenerar: boolean): void {
    if (regenerar) {
      // Emitir evento para regenerar este ejercicio
      this.ejercicioRechazado.emit(index);
    } else {
      // Eliminar el ejercicio
      this.ejercicios.splice(index, 1);
      this.ejerciciosActualizados.emit(this.ejercicios);
    }
  }

  // Método para verificar si un ejercicio está aprobado
  estaAprobado(ejercicio: Ejercicio): boolean {
    return (
      ejercicio.estado === 'aprobado' ||
      (ejercicio.ajustesNecesarios === 'ninguno' &&
        typeof ejercicio.calidad === 'number' &&
        ejercicio.calidad >= 4)
    );
  }

  // GENARAR EJERCICIO
  // -
  // -
  // -
  // Mostrar opciones de rechazo para un ejercicio específico
  showRejectionOptionsFor(index: number): void {
    this.showRejectionOptions =
      this.showRejectionOptions === index ? null : index;
    this.customSearchTerm = ''; // Resetear término de búsqueda
  }

  // Método para regenerar un ejercicio individual

  async regenerarEjercicio(index: number): Promise<void> {
    if (this.validacionIncompleta(this.ejercicios[index])) {
      return;
    }

    this.isRegenerating = true;

    const searchTerm =
      this.customSearchTerm.trim() ||
      this.ejercicios[index].titulo ||
      this.ejercicios[index].descripcion;

    const userData = {
      id_paciente: this.paciente.id_paciente,
      presion_arterial: {
        sistolica: this.paciente.presion_arterial?.sistolica || 0,
        diastolica: this.paciente.presion_arterial?.diastolica || 0,
      },
      frecuencia_cardiaca: this.paciente.frecuencia_cardiaca || 0,
      frecuencia_respiratoria: this.paciente.frecuencia_respiratoria || 0,
      temperatura: this.paciente.temperatura || 0,
      busqueda_personalizada: searchTerm,
      motivo_rechazo: this.obtenerMotivoRechazoAutomatico(
        this.ejercicios[index]
      ),
    };

    console.log('Datos del usuario para regenerar ejercicio:');
    console.log(this.ejercicios[index].titulo);

    // Mantenemos el subscribe para manejar la respuesta
    this.ejercicioGeneradoService
      .getEjercicioGenerado(this.ejercicios[index].titulo, 1, userData)
      .subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            // Reemplazar el ejercicio rechazado con el nuevo
            this.ejercicios[index] = response[0];
            this.ejerciciosActualizados.emit(this.ejercicios);
          }
          this.showRejectionOptions = null;
          this.isRegenerating = false;
          this.customSearchTerm = '';
        },
        error: (error) => {
          console.error('Error al regenerar ejercicio:', error);
          this.isRegenerating = false;
          // Opcional: Mostrar mensaje de error al usuario
        },
      });
  }

  // Eliminar ejercicio
  eliminarEjercicio(index: number): void {
    this.ejercicios.splice(index, 1);
    this.showRejectionOptions = null;
    this.ejerciciosActualizados.emit(this.ejercicios);
  }

  validacionIncompleta(ejercicio: Ejercicio): boolean {
    return (
      ejercicio.calidad === null ||
      ejercicio.calidad === undefined ||
      ejercicio.calidad === 0 ||
      !ejercicio.ajustesNecesarios ||
      !ejercicio.notasValidacion
    );
  }

  obtenerMotivoRechazoAutomatico(ejercicio: Ejercicio): string {
    if (!ejercicio.calidad || ejercicio.calidad < 2) {
      return 'Calidad muy baja (★' + (ejercicio.calidad || 0) + '/5)';
    }

    switch (ejercicio.ajustesNecesarios) {
      case 'rediseñar':
        return (
          'Requiere rediseño completo - ' +
          (ejercicio.notasValidacion || 'Sin comentarios adicionales')
        );
      case 'importantes':
        return (
          'Necesita ajustes importantes - ' +
          (ejercicio.notasValidacion || 'Sin comentarios adicionales')
        );
      case 'menores':
        return (
          'Requiere ajustes menores - ' +
          (ejercicio.notasValidacion || 'Sin comentarios adicionales')
        );
      default:
        return ejercicio.notasValidacion || 'Motivo no especificado';
    }
  }

  intentarRechazar(index: number): void {
    if (this.validacionIncompleta(this.ejercicios[index])) {
      // Mostrar panel de rechazo pero con advertencia
      this.showRejectionOptions =
        this.showRejectionOptions === index ? null : index;
      return;
    }

    // Si la validación está completa, mostrar opciones de rechazo
    this.showRejectionOptions = index;
  }
}
