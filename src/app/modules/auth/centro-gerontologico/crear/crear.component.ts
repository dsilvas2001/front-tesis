import { Component } from '@angular/core';
import { LoadingService } from '../../../../core/loading/loading.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';

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

    if (!id_administrador) {
      this.showNotification('Error', 'Sesión no válida', 'error');
      this.loadingService.hide();
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
        localStorage.removeItem('token_seleccion');

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
    this.router.navigate(['/Auth/login']);
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
