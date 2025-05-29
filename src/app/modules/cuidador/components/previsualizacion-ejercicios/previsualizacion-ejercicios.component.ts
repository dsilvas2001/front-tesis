import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

export interface Ejercicio {
  titulo: string;
  descripcion: string;
  instrucciones: string;
  dificultad: string;
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
  calidad?: number; // puede ser 0-5
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
  @Input() paciente!: Paciente;

  editingStates: Record<number, Record<string, boolean>> = {};

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ejercicios']) {
      this.copiasTemporales = {}; // limpiar para evitar acumulación innecesaria
      this.editingStates = {};
    }
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
}
