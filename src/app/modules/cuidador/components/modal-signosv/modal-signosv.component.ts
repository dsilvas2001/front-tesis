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
import { SignosVitalesService } from '../../../../core/cuidador/signos-vitales/signos-vitales.service';
import { PacienteService } from '../../../../core/cuidador/paciente/paciente.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-signosv',
  templateUrl: './modal-signosv.component.html',
})
export class ModalSignosvComponent implements OnInit, OnChanges {
  registerForm: FormGroup;
  //MODAL
  private _actionModal: string = 'add';
  private _pacienteData: any = 'add';
  private _idPaciente: string = '';
  icon: string = '';
  tituloModal: string = '';
  buttonModal: string = '';
  //
  ocultarClose: boolean = true;
  analisisIaData: any = ' ';
  mostrarExplicacion: boolean = true;

  // DROP
  presionArterialFields = [
    {
      id: 'pas',
      label: 'PAS',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null, // Inicializar con null
    },
    {
      id: 'pad',
      label: 'PAD',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null, // Inicializar con null
    },
  ];

  frecuenciaCardiacaFields = [
    {
      id: 'cardiaca',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null, // Inicializar con null
    },
  ];

  frecuenciaRespiratoriaFields = [
    {
      id: 'respiratoria',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null, // Inicializar con null
    },
  ];

  temperaturaFields = [
    {
      id: 'temperatura',
      type: 'number',
      placeholder: '0',
      required: true,
      value: null, // Inicializar con null
    },
  ];

  RANGOS_PERMITIDOS = {
    presionArterial: {
      pas: { min: 90, max: 130 }, // Rango para PAS
      pad: { min: 60, max: 89 }, // Rango para PAD
    },
    frecuenciaCardiaca: { min: 70, max: 90 }, // Rango para frecuencia cardíaca
    frecuenciaRespiratoria: { min: 11, max: 25 }, // Rango para frecuencia respiratoria
    temperatura: { min: 36, max: 37.5 }, // Rango para temperatura
  };

  //notification
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  //

  //DECORADORES

  @Input() statusModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @Output() userIdEvent = new EventEmitter<string>();
  @Input()
  set actionModal(value: string) {
    this._actionModal = value;
  }
  @Input()
  set pacienteData(value: any) {
    if (value && value !== this._pacienteData) {
      // Solo actualiza si el valor es nuevo
      this._pacienteData = value;
      this.updateModalTitleAndButton();
    }
  }

  // Campos del formulario
  visibleDescriptionIA = true;
  isProcessing = false;
  statusSV: 'emergencia' | 'estable' = 'estable';
  titleStatusSV = 'Paciente se encuentra estable';

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private signosVServices: SignosVitalesService
  ) {
    this.registerForm = this.formbuilder.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    console.log('tituloModal');
    console.log(this.tituloModal);
  }

  // CARGAR DATOS

  updateModalTitleAndButton(): void {
    if (this._actionModal !== 'Ingresar') {
      this.tituloModal = 'Editar SV';
      this.buttonModal = 'Editar SV';
      this.icon = 'fa-regular fa-pen-to-square';
      this.visibleDescriptionIA = true;
      this.cargarDatosPaciente();
    } else {
      this.tituloModal = 'Añadir SV';
      this.buttonModal = 'Añadir SV';
      this.icon = 'fa-solid fa-plus';
      this.visibleDescriptionIA = false;
      this._idPaciente = this._pacienteData.id_paciente;
      this.registerForm.patchValue({
        name: `${this._pacienteData.nombre} ${this._pacienteData.apellido}`,
      });
    }
  }

  cargarDatosPaciente(): void {
    if (this._pacienteData.id_paciente) {
      console.log('Datos del paciente:', this._pacienteData);
      this._idPaciente = this._pacienteData.id_paciente;
      this.registerForm.patchValue({
        name: `${this._pacienteData.nombre} ${this._pacienteData.apellido}`,
      });

      this.signosVServices
        .findByPacienteAndFecha(this._idPaciente, this._pacienteData.fecha)
        .subscribe(
          (datas: any[]) => {
            console.log('Datos del paciente:', datas);
            if (datas.length > 0) {
              this.presionArterialFields[0].value =
                datas[0].presion_arterial.sistolica;
              this.presionArterialFields[1].value =
                datas[0].presion_arterial.diastolica;
              this.frecuenciaCardiacaFields[0].value =
                datas[0].frecuencia_cardiaca;
              this.frecuenciaRespiratoriaFields[0].value =
                datas[0].frecuencia_respiratoria;
              this.temperaturaFields[0].value = datas[0].temperatura;
              this.analisisIaData = datas[0].analisis_ia;
              this.statusSV = datas[0].analisis_ia.statusSV;
              this.titleStatusSV =
                this.statusSV === 'emergencia'
                  ? 'Paciente se encuentra inestable'
                  : 'Paciente se encuentra estable';
            }
          },
          (error) => {
            console.error('Error fetching users:', error);
          }
        );
    }
  }
  toggleVista(tipo: string) {
    if (tipo === 'explicacion') {
      this.mostrarExplicacion = true;
    } else if (tipo === 'recomendaciones') {
      this.mostrarExplicacion = false;
    }
  }

  // SERVICIOS

  // MODIFICACION MODAL

  // Manejo del submit
  onSubmit() {
    if (this.registerForm.valid && this.validateFields()) {
      const sVitalesDto = {
        presion_arterial: {
          sistolica: this.presionArterialFields[0].value || 0,
          diastolica: this.presionArterialFields[1].value || 0,
        },
        frecuencia_cardiaca: this.frecuenciaCardiacaFields[0].value || 0,
        frecuencia_respiratoria:
          this.frecuenciaRespiratoriaFields[0].value || 0,
        temperatura: this.temperaturaFields[0].value || 0,
      };

      this.isProcessing = true;

      if (this._actionModal === 'Ingresar') {
        const signosVitalesDto = {
          ...sVitalesDto,
          id_paciente: this._idPaciente,
        };

        console.log('Signos Vitales:', signosVitalesDto);

        this.signosVServices.registerSignosVitales(signosVitalesDto).subscribe(
          (response) => {
            console.log('Referencia registrada con éxito:', response);
            this.ocultarClose = false;

            this.isProcessing = false;
            this.statusSV = response.analisis_ia.statusSV;

            this.titleStatusSV =
              this.statusSV === 'emergencia'
                ? 'Paciente se encuentra inestable'
                : 'Paciente se encuentra estable';

            this.visibleDescriptionIA = true;

            this.analisisIaData = response.analisis_ia;
          },
          (error: HttpErrorResponse) => {
            console.log('Error al registrar referencia:', error);

            if (typeof error.error === 'object') {
              this.isProcessing = false;

              console.log('Error objeto:', error.error);
              this.ocultarClose = true;

              this.showNotification('Error', error.error.error, 'error');
            }
          }
        );
      } else {
        this.signosVServices
          .updateSignosV(
            this._idPaciente,
            this._pacienteData.fecha,
            sVitalesDto
          )
          .subscribe(
            (response) => {
              console.log('Signos Vitales con éxito:', response);
              this.isProcessing = false;
              this.ocultarClose = false;

              this.visibleDescriptionIA = true;
              this.statusSV = response.analisis_ia.statusSV;

              this.analisisIaData = response.analisis_ia;
            },
            (error: HttpErrorResponse) => {
              console.log('Error al actualizar referencia:', error);

              if (typeof error.error === 'object') {
                console.log('Error objeto:', error.error);
                this.isProcessing = false;

                this.ocultarClose = true;
                this.showNotification('Error', error.error.error, 'error');
              }
            }
          );
      }
    }
  }

  validateFields(): boolean {
    let isValid = true;

    // Validar presión arterial
    const pas = this.presionArterialFields[0]?.value;
    const pad = this.presionArterialFields[1]?.value;

    if (
      pas != null &&
      (pas < this.RANGOS_PERMITIDOS.presionArterial.pas.min ||
        pas > this.RANGOS_PERMITIDOS.presionArterial.pas.max)
    ) {
      this.showNotification(
        'Error',
        'La presión arterial sistólica (PAS) está fuera de rango.',
        'error'
      );
      isValid = false;
    }

    if (
      pad != null &&
      (pad < this.RANGOS_PERMITIDOS.presionArterial.pad.min ||
        pad > this.RANGOS_PERMITIDOS.presionArterial.pad.max)
    ) {
      this.showNotification(
        'Error',
        'La presión arterial diastólica (PAD) está fuera de rango.',
        'error'
      );
      isValid = false;
    }

    // Validar frecuencia cardíaca
    const cardiaca = this.frecuenciaCardiacaFields[0]?.value ?? 0;

    if (
      cardiaca < this.RANGOS_PERMITIDOS.frecuenciaCardiaca.min ||
      cardiaca > this.RANGOS_PERMITIDOS.frecuenciaCardiaca.max
    ) {
      this.showNotification(
        'Error',
        'La frecuencia cardíaca está fuera de rango.',
        'error'
      );
      isValid = false;
    }

    // Validar frecuencia respiratoria
    const respiratoria = this.frecuenciaRespiratoriaFields[0]?.value ?? 0;

    if (
      respiratoria < this.RANGOS_PERMITIDOS.frecuenciaRespiratoria.min ||
      respiratoria > this.RANGOS_PERMITIDOS.frecuenciaRespiratoria.max
    ) {
      this.showNotification(
        'Error',
        'La frecuencia respiratoria está fuera de rango.',
        'error'
      );
      isValid = false;
    }

    // Validar temperatura
    const temperatura = this.temperaturaFields[0]?.value ?? 0;

    if (
      temperatura < this.RANGOS_PERMITIDOS.temperatura.min ||
      temperatura > this.RANGOS_PERMITIDOS.temperatura.max
    ) {
      this.showNotification(
        'Error',
        'La temperatura está fuera de rango.',
        'error'
      );
      isValid = false;
    }

    return isValid;
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

  //MODAL
  resetFields(fields: any[]) {
    if (fields) {
      fields.forEach((field) => {
        field.value = null;
      });
    }
  }

  closeModal() {
    // Cerrar el modal
    // Resetear todos los campos
    this.resetFields(this.temperaturaFields);
    this.resetFields(this.frecuenciaCardiacaFields);
    this.resetFields(this.frecuenciaRespiratoriaFields);
    this.resetFields(this.presionArterialFields);
    this.visibleDescriptionIA = false;
    this.ocultarClose = true;

    this.statusModal = false;
    this.closeModalEvent.emit(false);
  }

  aceptCloseModal() {
    this.userIdEvent.emit('1dlkdkjdkjdkjdkjd');
    this.closeModal();
  }

  // BUTTON

  onGenerateAnalysis() {
    // Cambiamos el estado a "procesando"
    this.isProcessing = true;
    // Simulación de proceso asíncrono (3 segundos)
    setTimeout(() => {
      // Volvemos al estado normal
      this.isProcessing = false;
      // Aquí podrías manejar la respuesta final (por ejemplo, mostrar un mensaje)
    }, 3000);
  }
}
