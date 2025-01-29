import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-paciente',
  templateUrl: './modal-paciente.component.html',
})
export class ModalPacienteComponent implements OnInit {
  registerForm: FormGroup;
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';

  @Input() statusModal: boolean = false;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() userIdEvent = new EventEmitter<string>();

  constructor(private formbuilder: FormBuilder, private router: Router) {
    this.registerForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      lastname: ['', Validators.required],
      age: ['', [Validators.required]],
      gender: ['Seleccionar genero', [Validators.required]],
    });
  }

  closeModal() {
    this.statusModal = false;
    console.log(this.statusModal);

    this.closeModalEvent.emit();
  }
  ngOnInit(): void {
    console.log(this.statusModal);
  }
}
