import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styles: ``,
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';

  constructor(
    private formbuilder: FormBuilder,
    private router: Router,
    private authServices: AuthService
  ) {
    this.registerForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      names: ['', [Validators.required]],
      lastNames: ['', Validators.required],
      password: ['', [Validators.required]],
      experience: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userDto = {
        nombre: this.registerForm.get('names')?.value,
        apellido: this.registerForm.get('lastNames')?.value,
        experiencia_anios: this.registerForm.get('experience')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        roles: 'Cuidador',
      };

      this.authServices.registerUser(userDto).subscribe(
        (response) => {
          console.log('Usuario registrado con éxito:', response);

          this.router.navigate(['/Auth/login']);
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
      console.log('Formulario inválido:', this.registerForm);
    }
  }

  sesionActive() {
    localStorage.setItem('prueba', 'true');
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
