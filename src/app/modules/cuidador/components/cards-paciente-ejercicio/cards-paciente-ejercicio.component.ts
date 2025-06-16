import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EjercicioPersonaService } from '../../../../core/cuidador/ejercicio-persona/ejercicio-persona.service';
import { SignosVitalesService } from '../../../../core/cuidador/signos-vitales/signos-vitales.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-cards-paciente-ejercicio',
  templateUrl: './cards-paciente-ejercicio.component.html',
  styles: ``,
  standalone: false,
})
export class CardsPacienteEjercicioComponent implements OnInit, OnChanges {
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
  _fechaCards: string = new Date().toISOString();
  selectedFilter: string = 'todos';

  // DECORADORES
  @Input() fechaCards: string = '';
  @Output() clickIdUser = new EventEmitter<any>();

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
      label: 'Mostrar todo',
      checked: false,
    },
  ];

  events: any[] = [];

  constructor(
    private ejercicioPersonaService: EjercicioPersonaService,
    private signosVServices: SignosVitalesService,
    private authService: AuthService
  ) {}

  // MOSTRAR CARDS

  mostrarAllUser(fecha: string, status: string) {
    this.isLoading = true;

    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Decodificar el token para obtener la información del centro
    const decodedToken = this.authService.getDecodedToken(token);

    if (!decodedToken?.centro_info?.id) {
      throw new Error('El usuario no tiene un centro asignado');
    }

    const centroId = decodedToken.centro_info.id;

    this.ejercicioPersonaService
      .getEjercicio(fecha, status, centroId)
      .subscribe(
        (datas: any[]) => {
          this.pacientes = datas;

          if (this.pacientes.length == 0) {
            this.showNotification(
              'Signos vitales',
              `No hay pacientes con signos vitales ${status} para esta fecha`,
              'error'
            );
          }

          // // Agregar acciones y actualizar pacientes
          // this.pacientes.forEach((paciente) => {
          //   paciente.actions = this.getActions(paciente.status);
          //   paciente.showDropdown = false;
          // });

          // this.updateDisplayedPacientes();
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
  //EXTRAER SIGNOS VITALES
  onSelectPaciente(id: any) {
    if (id) {
      this.signosVServices
        .findByPacienteAndFecha(id, this._fechaCards)
        .subscribe(
          (datas: any[]) => {
            console.log('Signos vitales del paciente:', datas);
            this.clickIdUser.emit(datas);
          },
          (error) => {
            console.error('Error fetching users:', error);
          }
        );
    }
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
          this.mostrarAllUser(this._fechaCards, 'todos');
          break;
        case 'incompleto':
          console.log('Mostrar pacientes en incompleto:', isChecked);
          this.mostrarAllUser(this.fechaCards, 'incompleto');
          break;
        case 'completo':
          console.log('Mostrar pacientes completo:', isChecked);
          this.mostrarAllUser(this.fechaCards, 'completo');
          break;
        case 'pendiente':
          console.log('Mostrar pacientes sin pendiente:', isChecked);
          this.mostrarAllUser(this.fechaCards, 'pendiente');
          break;
        default:
          break;
      }
    }
  }

  onUserIdReceived(userId: string) {
    this.mostrarAllUser(this.fechaCards, 'todos');

    // this.countPacienteEvent.emit();
  }

  // STATUS NOTIFICATION

  showSVNotification(paciente: any, action: string): void {
    this.actionModal = action;
    if (action === 'Eliminar') {
      this.pacienteData = paciente;
      this.showNotification(
        'Eliminar signos vitales',
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
        return 'fa-solid fa-brain text-indigo-400 text-3xl animate-pulse';
      case 'incompleto':
        return 'fa-solid fa-hourglass-end text-orange-500 text-3xl animate-pulse';
      case 'completo':
        return 'fa-solid fa-lightbulb text-green-400 text-3xl animate-bounce';
      default:
        return 'fa-solid fa-info text-gray-400 text-3xl';
    }
  }

  // Función para obtener el color según el estado
  getStatusColor(status: string): string {
    switch (status) {
      case 'pendiente':
        return 'bg-purple-600';
      case 'incompleto':
        return 'bg-sky-400';
      case 'completo':
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

  // VISUALIZAR EJERCICIOS REALIZADOS
  // Agrega estas propiedades
  showEjerciciosModal: boolean = false;
  selectedPacienteId: string = '';

  // Agrega estos métodos
  openEjerciciosModal(idPaciente: string): void {
    this.selectedPacienteId = idPaciente;
    this.showEjerciciosModal = true;
    console.log('this.selectedPacienteId', this.selectedPacienteId);
  }

  closeEjerciciosModal(): void {
    this.showEjerciciosModal = false;
    this.selectedPacienteId = '';
  }

  handleCardClick(event: MouseEvent, idPaciente: string) {
    // Verificar si el click fue en el botón "Ver ejercicios"
    const target = event.target as HTMLElement;
    const isVerEjerciciosButton = target.closest('.bg-blue-100');

    if (!isVerEjerciciosButton) {
      this.onSelectPaciente(idPaciente);
    }
  }
}
