import { Component } from '@angular/core';
import { LoadingService } from '../../../../core/loading/loading.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-crear',
  standalone: false,
  templateUrl: './crear.component.html',
  styles: ``,
})
export class CrearComponent {
  nombreCentro: string = '';
  direccion: string = '';
  codigoGenerado: string = '';
  isLoading: boolean = false;
  showSuccess: boolean = false;

  // Notificación
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  authForm: FormGroup;

  //
  password: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private authServices: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.authForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
    });

    this.loadingService.isLoading.subscribe((state) => {
      this.isLoading = state;
    });
  }

  generarCodigo(): string {
    return 'GERO-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  crearCentro() {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.loadingService.show();

    const token = localStorage.getItem('token_seleccion');
    const decoded = this.authServices.getDecodedToken(token || '');
    const id_administrador = decoded?.id;
    this.email = decoded?.email;

    this.password = localStorage.getItem('object') || '';

    if (!id_administrador) {
      this.showNotification('Error', 'Sesión no válida', 'error');

      this.loadingService.hide();
      setTimeout(() => {
        this.router.navigate(['/Auth/login']);
      }, 2000);
      return;
    }

    const { nombre, direccion } = this.authForm.value;

    const centroData = {
      nombre,
      direccion,
      id_administrador,
    };

    this.authServices.registerCentroGerontologico(centroData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        this.isLoading = false;

        this.codigoGenerado = response.codigo_unico;
        this.showSuccess = true;

        this.showNotification(
          'Centro creado',
          `Código generado: ${this.codigoGenerado}`,
          'success'
        );
      },
      error: (error) => {
        this.loadingService.hide();
        this.isLoading = false;
        this.showNotification(
          'Error',
          error.error?.error || 'Error al crear el centro',
          'error'
        );
      },
    });
  }

  irADashboard() {
    this.onSubmit();
  }

  onSubmit(): void {
    const userDto = {
      email: this.email,
      password: this.password,
    };
    console.log('Datos del usuario:', userDto);

    this.loadingService.show();

    this.authServices.loginUser(userDto).subscribe(
      (response) => {
        if (response.user.tiene_centro_asignado) {
          console.log('Inicio de sesión exitoso:', response);
          localStorage.setItem('token', response.token);
          localStorage.removeItem('token_seleccion');
          localStorage.removeItem('object');
          this.sesionActive();
          this.loadingService.hide();
          this.router.navigate(['/Cuidador/home/welcome']);
        }
      },
      (error: HttpErrorResponse) => {
        console.log('Error capturado al autenticar usuario:', error);

        if (typeof error.error === 'object') {
          this.loadingService.hide();
          this.showNotification('Error', error.error.error, 'error');
        }
      }
    );
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
