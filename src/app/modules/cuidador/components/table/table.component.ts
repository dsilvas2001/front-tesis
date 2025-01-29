import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PacienteService } from '../../../../core/cuidador/paciente/paciente.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: ``,
})
export class TableComponent implements OnInit {
  statusModal: boolean = false;
  pacientes: any[] = [];

  constructor(private pacienteServices: PacienteService) {}
  ngOnInit() {
    this.mostrarUser();
  }

  openModal() {
    this.statusModal = true;
    console.log('Modal abierto:', this.statusModal);
  }
  onUserIdReceived(userId: string) {}

  closeModal() {
    this.statusModal = false;
    console.log('Modal cerrado:', this.statusModal);
  }

  mostrarUser() {
    // this.currentDataSource = 'users';
    // this.isLoading = true;
    this.pacienteServices.getAllPaciente().subscribe(
      (datas: any[]) => {
        this.pacientes = datas; // Almacena los datos en un array
        console.log(this.pacientes); // Opcional: imprime el array completo
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}
