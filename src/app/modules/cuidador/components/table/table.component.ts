import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PacienteService } from '../../../../core/cuidador/paciente/paciente.service';
import { LoadingService } from '../../../../core/loading/loading.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: ``,
})
export class TableComponent implements OnInit {
  @Output() countPacienteEvent = new EventEmitter<void>();
  //Modal
  statusModal: boolean = false;
  actionModal: string = 'add';

  //Tabla
  pacientes: any[] = [];
  displayedPacientes: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;

  //Notificacion
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  pacienteData: any = null;
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
      {
        this.statusnotification = false;
      }
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
        console.log('Paciente eliminado:', data);
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
        this.updateDisplayedPacientes();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;

        console.error('Error fetching users:', error);
      }
    );
  }

  // PAGINATION

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
