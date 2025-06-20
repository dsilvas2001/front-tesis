import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../../../core/cuidador/paciente/paciente.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-modal-paciente',
  templateUrl: './modal-paciente.component.html',
  standalone: false,
})
export class ModalPacienteComponent implements OnInit, OnChanges {
  registerForm: FormGroup;
  //notification
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  //
  private _actionModal: string = 'add';
  private _pacienteData: any = 'add';
  private _idPaciente: string = '';
  icon: string = '';
  tituloModal: string = '';
  buttonModal: string = '';
  //
  centroId: any = null;

  //Decoradores
  @Input() statusModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() userIdEvent = new EventEmitter<string>();
  @Input()
  set actionModal(value: string) {
    this._actionModal = value;
  }
  @Input()
  set pacienteData(value: any) {
    this._pacienteData = value;
    this.updateModalTitleAndButton();
  }

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private pacienteServices: PacienteService
  ) {
    this.registerForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      gender: ['Seleccionar genero', [Validators.required]],
    });
  }

  ngOnInit(): void {
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
    this.updateModalTitleAndButton();
  }

  updateModalTitleAndButton(): void {
    if (this._actionModal === 'edit') {
      this.tituloModal = 'Editar paciente';
      this.buttonModal = 'Editar paciente';
      this.icon = 'fa-regular fa-pen-to-square';
      this.cargarDatosPaciente(); // Cargar datos del paciente en el formulario
    } else {
      this.tituloModal = 'Añadir Paciente';
      this.buttonModal = 'Añadir Paciente';
      this.icon = 'fa-solid fa-plus';
    }
  }

  cargarDatosPaciente(): void {
    this._idPaciente = this._pacienteData.id;
    this.registerForm.patchValue({
      name: this._pacienteData.nombre,
      lastname: this._pacienteData.apellido,
      age: this._pacienteData.edad,
      gender: this._pacienteData.genero,
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('id_centro_gerontologico:', this.centroId);

      const pacienteDto = {
        nombre: this.registerForm.get('name')?.value,
        apellido: this.registerForm.get('lastname')?.value,
        edad: this.registerForm.get('age')?.value,
        genero: this.registerForm.get('gender')?.value,
        roles: 'Paciente',
        id_centro_gerontologico: this.centroId,
      };
      if (this._actionModal === 'add') {
        this.pacienteServices.registerPaciente(pacienteDto).subscribe(
          (response) => {
            console.log('Usuario registrado con éxito:', response);
            this.userIdEvent.emit(String(response.id));
            this.closeModal();

            this.showNotification(
              'Correcto!',
              'Paciente Registrado',
              'success'
            );
          },
          (error: HttpErrorResponse) => {
            console.log('Error capturado al registrar usuario:', error);

            if (typeof error.error === 'object') {
              console.log('Error objeto:', error.error);
              this.showNotification('Error', error.error.error, 'error');
            }
          }
        );
      } else {
        this.pacienteServices
          .updatePaciente(this._idPaciente, pacienteDto)
          .subscribe(
            (response) => {
              console.log('Usuario ha sido editado con éxito:', response);
              this.userIdEvent.emit(String(response.id));
              this.closeModal();

              this.showNotification('Correcto!', 'Paciente Editado', 'success');
            },
            (error: HttpErrorResponse) => {
              console.log('Error capturado al registrar usuario:', error);

              if (typeof error.error === 'object') {
                console.log('Error objeto:', error.error);
                this.showNotification('Error', error.error.error, 'error');
              }
            }
          );
      }
    } else {
      console.log('Formulario inválido:', this.registerForm);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusModal'] && this.statusModal) {
      // Solo ejecuta si el modal se abre
      this.updateModalTitleAndButton();
      this.cargarDatosPaciente();
    }
  }

  closeModal() {
    this.statusModal = false;
    this.registerForm.reset({
      name: '',
      lastname: '',
      age: '',
      gender: 'Seleccionar genero',
    });

    this.closeModalEvent.emit();
  }

  showNotification(title: string, message: string, type: string) {
    this.statusnotification = true;
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.statusnotification = false;
    }, 3000);
  }
}
