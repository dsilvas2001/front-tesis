import { Component, EventEmitter, Output } from '@angular/core';
import { ReferenciaSignosVService } from '../../../../core/cuidador/referencia-signosV/referencia-signos-v.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { CuidadorService } from '../../../../core/cuidador/cuidador.service';

@Component({
  selector: 'app-table-cuidador',
  standalone: false,
  templateUrl: './table-cuidador.component.html',
  styles: ``,
})
export class TableCuidadorComponent {
  @Output() countPacienteEvent = new EventEmitter<void>();
  //Modal
  statusModal: boolean = false;
  actionModal: string = 'add';

  //Tabla
  pacientes: any[] = [];
  displayedPacientes: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';

  //Notificacion
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  pacienteData: any = null;
  statusDelete: boolean = false;
  //loading
  isLoading = false;

  //filter
  isDropdownOpen = false;
  showWithReference = true;
  showWithoutReference = false;
  //
  centroId: any = null;
  esAdministrador: boolean = false;
  //
  showAcceptConfirm: boolean = false;
  activePacienteId: string | null = null;

  //
  showAprobados = true;
  showNoAprobados = false;

  constructor(
    private cuidadorService: CuidadorService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No se encontró token de autenticación');
    }

    // Decodificar el token para obtener la información del centro
    const decodedToken = this.authService.getDecodedToken(token);

    if (!decodedToken?.centro_info?.id) {
      throw new Error('El usuario no tiene un centro asignado');
    }

    this.centroId = decodedToken.centro_info.id;
    this.esAdministrador = decodedToken?.es_administrador === true;
    this.cargarCuidadores();
  }

  cargarCuidadores(): void {
    this.isLoading = true;

    if (this.showAprobados) {
      this.cuidadorService.getAprobados(this.centroId).subscribe({
        next: (cuidadores) => {
          this.pacientes = cuidadores;
          this.filterPacientes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener cuidadores aprobados:', error);
          this.isLoading = false;
        },
      });
    } else if (this.showNoAprobados) {
      this.cuidadorService.getNoAprobados(this.centroId).subscribe({
        next: (cuidadores) => {
          this.pacientes = cuidadores;
          this.filterPacientes();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener cuidadores no aprobados:', error);
          this.isLoading = false;
        },
      });
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCheckboxChange(event: Event, type: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (type === 'withReference') {
      this.showAprobados = isChecked;
      this.showNoAprobados = !isChecked;
    } else if (type === 'withoutReference') {
      this.showNoAprobados = isChecked;
      this.showAprobados = !isChecked;
    }

    if (isChecked) {
      this.countPacienteEvent.emit();

      this.cargarCuidadores();
    }
  }
  aprobarCuidador(cuidador: any): void {
    this.cuidadorService.aprobarCuidador(cuidador.id).subscribe({
      next: () => {
        this.showNotification(
          'Éxito',
          'Cuidador aprobado correctamente',
          'success'
        );
        this.cargarCuidadores();
      },
      error: (error) => {
        console.error('Error al aprobar cuidador:', error);
        this.showNotification(
          'Error',
          'No se pudo aprobar el cuidador',
          'error'
        );
      },
    });
  }
  confirmAccept(cuidador: any): void {
    this.showAcceptConfirm = false;
    this.activePacienteId = null;
    this.aprobarCuidador(cuidador);
    this.countPacienteEvent.emit();
  }

  //  STATUS MODAL

  closeModal(statusModal: boolean): void {
    this.statusModal = statusModal;
  }

  abrirModal(paciente: any, actionModal: string): void {
    if (paciente && paciente.id) {
      this.actionModal = actionModal;
      this.pacienteData = paciente;
      this.statusModal = true;
    } else {
      console.error('Paciente no válido:', paciente);
    }
  }

  deletePaciente(pacientid: string): void {}

  // EVENTOS

  onUserIdReceived(userId: string) {
    this.onCheckboxChange(
      { target: { checked: this.showWithoutReference } } as any,
      'withReference'
    );
    this.countPacienteEvent.emit();
  }
  handleDeleteAction(confirmed: boolean): void {
    if (confirmed) {
      this.statusnotification = false;
      console.log('El usuario hizo clic en Aceptar');

      this.deletePaciente(this.pacienteData.id);
    } else {
      {
        this.statusnotification = false;
      }
      console.log('El usuario hizo clic en Cancelar');
    }
  }

  // NOTIFICATION

  showDeleteNotification(paciente: any): void {
    this.pacienteData = paciente;
    this.showNotification(
      'Eliminar Referencia',
      '¿Estás seguro de que deseas eliminar esta Referencia?',
      'delete'
    );
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

  // DATA TABLE

  // mostrarUser() {
  //   this.isLoading = true;
  //   this.referenciaSignosVServices.getAllReferencia().subscribe(
  //     (datas: any[]) => {
  //       this.pacientes = datas;

  //       this.updateDisplayedPacientes();
  //       this.isLoading = false;
  //     },
  //     (error) => {
  //       this.isLoading = false;

  //       console.error('Error fetching users:', error);
  //     }
  //   );
  // }

  //Pagination

  // Getter para pacientes filtrados (igual que en tu ejemplo)
  get filteredPacientes(): any[] {
    if (!this.searchTerm) {
      return this.pacientes;
    }
    return this.pacientes.filter(
      (paciente) =>
        paciente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        paciente.apellido.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Método para filtrar y paginar (igual que en tu ejemplo)
  filterPacientes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPacientes = this.filteredPacientes.slice(
      startIndex,
      endIndex
    );
  }

  // Método de cambio de página (igual que en tu ejemplo)
  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterPacientes();
  }

  // Método para calcular total de páginas (igual que en tu ejemplo)
  get totalPages(): number {
    return Math.ceil(this.filteredPacientes.length / this.itemsPerPage);
  }

  // Método de cambio de búsqueda (modificado para usar onSearchTermChange)
  onSearchTermChange(): void {
    this.currentPage = 1;
    this.filterPacientes();
  }
  //

  // Manejar la respuesta
  handleAcceptAction(confirmed: boolean): void {
    if (confirmed) {
      console.log('Usuario confirmó la aceptación para:', this.pacienteData);
      this.abrirModal(this.pacienteData, 'add');
    } else {
      console.log('Usuario canceló la aceptación');
    }
  }

  // Método para manejar la acción de aceptar
  showAcceptConfirmation(paciente: any): void {
    this.activePacienteId = paciente.id;
    this.showAcceptConfirm = true;
  }

  // Método para confirmar la acción

  // Método para cancelar
  cancelAccept(): void {
    this.showAcceptConfirm = false;
    this.activePacienteId = null;
    console.log('Aceptación cancelada');
  }
}
