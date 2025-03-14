import {
  Component,
  EventEmitter,
  Input,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SignosVitalesService } from '../../../../core/cuidador/signos-vitales/signos-vitales.service';
import { Output } from '@angular/core';

@Component({
  selector: 'app-cards-sv',
  templateUrl: './cards-sv.component.html',
  styles: ``,
})
export class CardsSvComponent implements OnInit, OnChanges {
  //Notificacion
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  statusDelete: boolean = false;
  //loading
  isLoading = false;

  //filter
  isDropdownOpen = false;
  showWithReference = true;
  showWithoutReference = false;

  //Cards
  pacientes: any[] = [];
  displayedPacientes: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  _fechaCards: string = '';
  selectedFilter: string = 'todos';

  // DECORADORES
  @Input() fechaCards: string = '';
  @Output() countPacienteEvent = new EventEmitter<void>();

  //Modal
  statusModal: boolean = false;
  actionModal: string = 'add';
  pacienteData: any = null;

  // Ejemplo: Lista de eventos recibidos desde el backend
  backendEvents = [
    {
      id: 'id_paciente_1',
      date: 'Jan 10, 2020 - 10:00 - 11:00',
      title: 'Donald Silva',
      description: 'Necesita revisión de signos vitales',
      status: 'pendiente', // Viene del backend
    },
    {
      id: 'id_paciente_2',
      date: 'Jan 10, 2020 - 05:40 - 13:00',
      title: 'Claudia Bravo',
      description: 'Signos vitales fuera de rango, evitar hacer ejercicio',
      status: 'emergencia', // Viene del backend
    },
    {
      id: 'id_paciente_3',
      date: 'Jan 14, 2020 - 10:00 - 11:00',
      title: 'Pedro Granja',
      description: 'Signos vitales normales, puede hacer ejercicio',
      status: 'estable', // Viene del backend
    },
  ];
  filterOptions = [
    {
      id: 'allSV',
      label: 'Mostrar Todo',
      checked: false,
    },
    {
      id: 'emergency',
      label: 'Pacientes en Emergencia',
      checked: false,
    },
    {
      id: 'stable',
      label: 'Pacientes Estables',
      checked: false,
    },
    {
      id: 'withoutSV',
      label: 'Pacientes sin SV',
      checked: false,
    },
  ];

  events: any[] = [];

  constructor(private signosVitalesService: SignosVitalesService) {}

  // MOSTRAR CARDS

  mostrarAllUser(fecha: string, status: string) {
    this.isLoading = true;

    this.signosVitalesService.getAllSignosVitales(fecha, status).subscribe(
      (datas: any[]) => {
        this.pacientes = datas;
        if (this.pacientes.length == 0) {
          this.showNotification(
            'Signos Vitales',
            `No hay pacientes con signos vitales ${status} para esta fecha`,
            'error'
          );
        }

        // Agregar acciones y actualizar pacientes
        this.pacientes.forEach((paciente) => {
          paciente.actions = this.getActions(paciente.status);
          paciente.showDropdown = false;
        });

        this.updateDisplayedPacientes();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error('Error fetching users:', error);
      }
    );
  }

  ngOnInit(): void {
    this.onCheckboxChange({ target: { checked: true } } as any, 'allSV');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia la fecha, ejecuta la lógica del checkbox seleccionado
    if (changes['fechaCards'] && this.fechaCards) {
      const selectedOption = this.getSelectedOption();
      if (selectedOption) {
        this.onCheckboxChange(
          { target: { checked: true } } as any,
          selectedOption.id
        );
      }
    }
  }

  getSelectedOption():
    | { id: string; label: string; checked: boolean }
    | undefined {
    return this.filterOptions.find((option) => option.checked);
  }

  //CHECKBOX

  onCheckboxChange(event: Event, optionId: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Si se marca un checkbox, desmarcar los demás
    this.filterOptions = this.filterOptions.map((option) => ({
      ...option,
      checked: option.id === optionId ? isChecked : false, // Solo el seleccionado queda marcado
    }));

    if (isChecked) {
      // Ejecutar la lógica según la opción seleccionada
      switch (optionId) {
        case 'allSV':
          console.log('Mostrar pacientes con SV:', isChecked);
          this.mostrarAllUser(this.fechaCards, 'todos');
          break;
        case 'emergency':
          console.log('Mostrar pacientes en emergencia:', isChecked);
          this.mostrarAllUser(this.fechaCards, 'emergencia');
          break;
        case 'stable':
          console.log('Mostrar pacientes estables:', isChecked);
          this.mostrarAllUser(this.fechaCards, 'estable');
          break;
        case 'withoutSV':
          console.log('Mostrar pacientes sin SV:', isChecked);
          this.mostrarAllUser(this.fechaCards, 'pendiente');
          break;
        default:
          break;
      }
    }
  }

  // EVENTO

  handleDeleteAction(confirmed: boolean): void {
    if (confirmed) {
      this.statusnotification = false;
      console.log('El usuario hizo clic en Aceptar');

      this.deletePaciente(this.pacienteData.id_paciente);
    } else {
      {
        this.statusnotification = false;
      }
      console.log('El usuario hizo clic en Cancelar');
    }
  }
  onUserIdReceived(userId: string) {
    this.mostrarAllUser(this.fechaCards, 'todos');

    this.countPacienteEvent.emit();
  }

  // STATUS NOTIFICATION

  deletePaciente(pacientid: string): void {
    this.signosVitalesService
      .deletePaciente(pacientid, this.fechaCards)
      .subscribe(
        (data) => {
          this.showNotification(
            'Correcto!',
            'Signos Vitales eliminada',
            'success'
          );
          this.mostrarAllUser(this.fechaCards, 'todos');
          // this.countPacienteEvent.emit();
        },
        (error) => {
          console.error('Error al eliminar la Referencia eliminada:', error);
        }
      );
  }

  showSVNotification(paciente: any, action: string): void {
    this.actionModal = action;
    if (action === 'Eliminar') {
      this.pacienteData = paciente;
      this.showNotification(
        'Eliminar Signos Vitales',
        `¿Estás seguro de que deseas eliminar este Signo Vital del ${paciente.nombre} ${paciente.apellido}?`,
        'delete'
      );
    } else {
      this.pacienteData = { ...paciente, fecha: this.fechaCards }; // Solo actualiza cuando sea necesario
      this.statusModal = true;
    }
  }

  showNotification(title: string, message: string, type: string) {
    this.statusnotification = true;
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;
    if (type !== 'delete') {
      setTimeout(() => {
        this.statusnotification = false;
      }, 3000);
    }
  }

  // Devuelve las acciones según el estado
  getActions(status: string): string[] {
    if (status === 'pendiente') {
      return ['Ingresar'];
    } else if (status === 'emergencia' || status === 'estable') {
      return ['Editar', 'Eliminar'];
    }
    return [];
  }

  // Función para mostrar/ocultar el dropdown
  toggleFilterDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleDropdown(pacienteId: string) {
    this.pacientes = this.pacientes.map((paciente) => ({
      ...paciente,
      showDropdown:
        paciente.id_paciente === pacienteId ? !paciente.showDropdown : false,
    }));
  }

  // Función para obtener el ícono según el estado
  getStatusIcon(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'fa-solid fa-heart-circle-plus text-blue-500 text-3xl animate-pulse';
      case 'emergencia':
        return 'fa-solid fa-heart-circle-exclamation text-red-500 text-3xl animate-bounce';
      case 'estable':
        return 'fa-solid fa-heart-pulse text-green-500 text-3xl';
      default:
        return 'fa-solid fa-heart text-gray-500 text-3xl';
    }
  }

  // Función para obtener el color según el estado
  getStatusColor(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'bg-purple-600';
      case 'emergencia':
        return 'bg-sky-400';
      case 'estable':
        return 'bg-emerald-600';
      default:
        return 'bg-gray-500';
    }
  }
  closeModal(statusModal: boolean): void {
    this.statusModal = statusModal;
  }

  //Pagination

  updateDisplayedPacientes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPacientes = this.pacientes.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedPacientes();
  }

  get totalPages(): number {
    return Math.ceil(this.pacientes.length / this.itemsPerPage);
  }
}
