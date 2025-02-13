import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PacienteService } from '../../../../core/cuidador/paciente/paciente.service';
import { ReferenciaSignosVService } from '../../../../core/cuidador/referencia-signosV/referencia-signos-v.service';

@Component({
  selector: 'app-table-referencias-signos-v',
  templateUrl: './table-referencias-signos-v.component.html',
  styles: ``,
})
export class TableReferenciasSignosVComponent implements OnInit {
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

  //filter
  isDropdownOpen = false;
  showWithReference = true;
  showWithoutReference = false;

  constructor(private referenciaSignosVServices: ReferenciaSignosVService) {}

  ngOnInit() {
    this.mostrarUser();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCheckboxChange(event: Event, type: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (type === 'withReference') {
      this.showWithReference = isChecked;
      this.showWithoutReference = false;
      if (isChecked) {
        this.mostrarUser();
      }
    } else if (type === 'withoutReference') {
      this.showWithoutReference = isChecked;
      this.showWithReference = false;
      if (isChecked) {
        this.mostrarNotReferencia();
      }
    }
  }

  //  STATUS MODAL

  closeModal(statusModal: boolean): void {
    this.statusModal = statusModal;
  }

  abrirModal(paciente: any, actionModal: string): void {
    this.actionModal = actionModal;
    this.pacienteData = paciente;
    this.statusModal = true; // Abrir el modal
  }

  deletePaciente(pacientid: string): void {
    this.referenciaSignosVServices.deleteReferencia(pacientid).subscribe(
      (data) => {
        console.log('Referencia eliminada:', data);
        this.mostrarUser();

        this.showNotification('Correcto!', 'Referencia eliminada', 'success');

        this.countPacienteEvent.emit();
      },
      (error) => {
        console.error('Error al eliminar la Referencia eliminada:', error);
      }
    );
  }

  // EVENTOS

  onUserIdReceived(userId: string) {
    this.mostrarUser();
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

  mostrarUser() {
    this.isLoading = true;
    this.referenciaSignosVServices.getAllReferencia().subscribe(
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
  mostrarNotReferencia() {
    this.isLoading = true;
    this.referenciaSignosVServices.getAllNotReferencia().subscribe(
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
