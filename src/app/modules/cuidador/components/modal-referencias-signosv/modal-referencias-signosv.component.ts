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
import { PacienteService } from '../../../../core/cuidador/paciente/paciente.service';
import { Router } from '@angular/router';
import { ReferenciaSignosVService } from '../../../../core/cuidador/referencia-signosV/referencia-signos-v.service';

@Component({
  selector: 'app-modal-referencias-signosv',
  templateUrl: './modal-referencias-signosv.component.html',
  styles: ``,
})
export class ModalReferenciasSignosvComponent implements OnInit, OnChanges {
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

  //DROP
  isDropdownOpen: boolean = false; // Estado del dropdown
  presionArterialFields = [
    {
      id: 'pas-min',
      label: 'PAS (Min)',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
    {
      id: 'pad-min',
      label: 'PAD (Min)',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
    {
      id: 'pas-max',
      label: 'PAS (Max)',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
    {
      id: 'pad-max',
      label: 'PAD (Max)',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
  ];

  frecuenciaCardiacaFields = [
    {
      id: 'cardiaca-min',
      label: 'Min',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
    {
      id: 'cardiaca-max',
      label: 'Max',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
  ];
  frecuenciaRespiratoriaFields = [
    {
      id: 'respiratoria-min',
      label: 'Min',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
    {
      id: 'respiratoria-max',
      label: 'Max',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
  ];
  temperaturaFields = [
    {
      id: 'temperatura-min',
      label: 'Min',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
    {
      id: 'temperatura-max',
      label: 'Max',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null,
    },
  ];

  //Decoradores
  @Input() statusModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();
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
    private referenciaSignosVService: ReferenciaSignosVService
  ) {
    this.registerForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', Validators.required],
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['statusModal'] && this.statusModal) {
      // Solo ejecuta si el modal se abre
      this.updateModalTitleAndButton();
      this.cargarDatosPaciente();
    }
  }
  onFieldChange(updatedField: any): void {
    console.log('Campo actualizado:', updatedField);

    // Actualiza el valor en el arreglo del padre
    const fieldIndex = this.presionArterialFields.findIndex(
      (field) => field.id === updatedField.id
    );
    if (fieldIndex !== -1) {
      this.presionArterialFields[fieldIndex].value = updatedField.value;
    }

    console.log('Datos actualizados:', this.presionArterialFields);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit(): void {}

  // CARGAR DATOS

  updateModalTitleAndButton(): void {
    if (this._actionModal === 'edit') {
      this.tituloModal = 'Editar Referencia SV';
      this.buttonModal = 'Editar Referencia SV';
      this.icon = 'fa-regular fa-pen-to-square';
    } else {
      this.tituloModal = 'Añadir Referencia SV';
      this.buttonModal = 'Añadir Referencia SV';
      this.icon = 'fa-solid fa-plus';
    }

    this.cargarDatosPaciente();
  }

  cargarDatosPaciente(): void {
    this._idPaciente = this._pacienteData.id;

    console.log('INGRESA AL FORM DE NUEVO??');

    this.registerForm.patchValue({
      name: this._pacienteData.nombre,
      lastname: this._pacienteData.apellido,
    });
    //ARTERIA
    this.presionArterialFields[0].value =
      this._pacienteData.presion_arterial.sistolica_min;
    this.presionArterialFields[1].value =
      this._pacienteData.presion_arterial.diastolica_min;
    this.presionArterialFields[2].value =
      this._pacienteData.presion_arterial.sistolica_max;
    this.presionArterialFields[3].value =
      this._pacienteData.presion_arterial.diastolica_max;
    //FRECUENCIA_CARDIACA
    this.frecuenciaCardiacaFields[0].value =
      this._pacienteData.frecuencia_cardiaca.min;
    this.frecuenciaCardiacaFields[1].value =
      this._pacienteData.frecuencia_cardiaca.max;

    //FRECUENCIA_RESPIRATORIA
    this.frecuenciaRespiratoriaFields[0].value =
      this._pacienteData.frecuencia_respiratoria.min;
    this.frecuenciaRespiratoriaFields[1].value =
      this._pacienteData.frecuencia_respiratoria.max;

    //TEMPERATURA

    this.temperaturaFields[0].value = this._pacienteData.temperatura.min;
    this.temperaturaFields[1].value = this._pacienteData.temperatura.max;
  }

  // SERVICIOS

  onSubmit(): void {
    if (this.registerForm.valid) {
      const referenciaDto = {
        presion_arterial: {
          sistolica_min: this.presionArterialFields[0].value || 0,
          diastolica_min: this.presionArterialFields[1].value || 0,
          sistolica_max: this.presionArterialFields[2].value || 0,
          diastolica_max: this.presionArterialFields[3].value || 0,
        },
        frecuencia_cardiaca: {
          min: this.frecuenciaCardiacaFields[0].value || 0,
          max: this.frecuenciaCardiacaFields[1].value || 0,
        },
        frecuencia_respiratoria: {
          min: this.frecuenciaRespiratoriaFields[0].value || 0,
          max: this.frecuenciaRespiratoriaFields[1].value || 0,
        },
        temperatura: {
          min: this.temperaturaFields[0].value || 0,
          max: this.temperaturaFields[1].value || 0,
        },
      };

      if (this._actionModal === 'add') {
        const referenciaFDto = {
          ...referenciaDto, // Mantiene los valores existentes
          id_paciente: this._idPaciente, // Agrega el nuevo atributo
        };

        this.referenciaSignosVService
          .registerReferenciaSignosV(referenciaFDto)
          .subscribe(
            (response) => {
              console.log('Referencia registrada con éxito:', response);
              this.userIdEvent.emit(String(response.id));
              this.closeModal();

              this.showNotification(
                'Correcto!',
                'Referencia Registrada',
                'success'
              );
            },
            (error: HttpErrorResponse) => {
              console.log('Error al registrar referencia:', error);

              if (typeof error.error === 'object') {
                console.log('Error objeto:', error.error);
                this.showNotification('Error', error.error.error, 'error');
              }
            }
          );
      } else {
        this.referenciaSignosVService
          .updateReferencia(this._idPaciente, referenciaDto)
          .subscribe(
            (response) => {
              console.log('Referencia actualizada con éxito:', response);
              this.userIdEvent.emit(String(response.id));
              this.closeModal();

              this.showNotification(
                'Correcto!',
                'Referencia Actualizada',
                'success'
              );
            },
            (error: HttpErrorResponse) => {
              console.log('Error al actualizar referencia:', error);

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

  //MODAL

  closeModal() {
    this.statusModal = false;
    this.registerForm.reset({
      name: '',
      lastname: '',
      age: '',
      gender: 'Seleccionar genero',
    });

    this.closeModalEvent.emit(false);
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
