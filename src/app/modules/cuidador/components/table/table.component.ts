import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PacienteService } from '../../../../core/cuidador/paciente/paciente.service';
import { LoadingService } from '../../../../core/loading/loading.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: ``,
  standalone: false,
})
export class TableComponent implements OnInit {
  @Output() countPacienteEvent = new EventEmitter<void>();
  //Modal
  statusModal: boolean = false;
  actionModal: string = 'add';
  pacienteData: any = null;

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
  statusDelete: boolean = false;
  //loading
  isLoading = false;

  constructor(private pacienteServices: PacienteService) {}

  ngOnInit() {
    this.mostrarUser();
  }

  closeModal() {
    this.statusModal = false;
  }

  abrirModal(paciente: any, actionModal: string): void {
    this.actionModal = actionModal;
    this.pacienteData = actionModal === 'edit' ? paciente : null;
    this.statusModal = true; // Abrir el modal
  }

  // EVENTOS

  handleDeleteAction(confirmed: boolean): void {
    if (confirmed) {
      this.statusnotification = false;
      console.log('El usuario hizo clic en Aceptar');

      this.deletePaciente(this.pacienteData.id);
    } else {
      this.statusnotification = false;

      console.log('El usuario hizo clic en Cancelar');
    }
  }

  onUserIdReceived(userId: string) {
    this.mostrarUser();
    this.countPacienteEvent.emit();
  }

  deletePaciente(pacientid: string): void {
    this.pacienteServices.deletePaciente(pacientid).subscribe(
      (data) => {
        this.mostrarUser();

        this.showNotification('Correcto!', 'Paciente Eliminado', 'success');

        this.countPacienteEvent.emit();
      },
      (error) => {
        console.error('Error al eliminar el paciente:', error);
      }
    );
  }

  // NOTIFICACION

  showDeleteNotification(paciente: any): void {
    this.pacienteData = paciente;
    this.showNotification(
      'Eliminar Paciente',
      '¿Estás seguro de que deseas eliminar este paciente?',
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

  // TABLE

  mostrarUser() {
    this.isLoading = true;
    this.pacienteServices.getAllPaciente().subscribe(
      (datas: any[]) => {
        this.pacientes = datas;
        this.isLoading = false;
        this.filterPacientes();
      },
      (error) => {
        this.isLoading = false;

        console.error('Error fetching users:', error);
      }
    );
  }

  // PAGINATION
  onPageChange(page: number): void {
    this.currentPage = page;
    this.filterPacientes(); // Cambia esto de updateDisplayedPacientes a filterPacientes
  }
  get totalPages(): number {
    const totalItems = this.searchTerm
      ? this.pacientes.filter(
          (p) =>
            p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            p.apellido.toLowerCase().includes(this.searchTerm.toLowerCase())
        ).length
      : this.pacientes.length;
    return Math.ceil(totalItems / this.itemsPerPage);
  }

  // Método para obtener el total de items filtrados
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

  // Método para filtrar y paginar
  filterPacientes(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPacientes = this.filteredPacientes.slice(
      startIndex,
      endIndex
    );
  }

  // Método para manejar cambios en el input de búsqueda
  onSearchChange(searchValue: string): void {
    this.searchTerm = searchValue;
    this.currentPage = 1; // Resetear a la primera página al buscar
    this.filterPacientes();
  }
  onSearchTermChange(): void {
    this.currentPage = 1;
    this.filterPacientes();
  }
}
