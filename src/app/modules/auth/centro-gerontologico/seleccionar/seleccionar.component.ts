import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/loading/loading.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-seleccionar',
  standalone: false,
  templateUrl: './seleccionar.component.html',
  styles: ``,
})
export class SeleccionarComponent {
  isLoading: boolean = false;

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
      codigo_centro: ['', [Validators.required]],
    });

    this.loadingService.isLoading.subscribe((state) => {
      this.isLoading = state;
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) return;

    const codigoCentro = this.authForm.value.codigo_centro;

    console.log('Código de centro:', codigoCentro);

    this.isLoading = true;
    this.loadingService.show();

    const token = localStorage.getItem('token_seleccion');
    if (!token) {
      this.showNotification('Error', 'Sesión no válida', 'error');
      this.loadingService.hide();
      return;
    }

    const decoded = this.authServices.getDecodedToken(token);
    const id_usuario = decoded?.id;

    if (!id_usuario) {
      this.showNotification(
        'Error',
        'No se pudo obtener el ID de usuario',
        'error'
      );
      this.loadingService.hide();
      return;
    }

    const centroData = {
      id_usuario,
      codigo_centro: codigoCentro,
    };

    this.authServices.codigoCentroGerontologico(centroData).subscribe({
      next: (response) => {
        this.loadingService.hide();
        localStorage.removeItem('token_seleccion');
        this.showNotification(
          'Éxito',
          'Te uniste correctamente al centro vuelve a iniciar sesion',
          'success'
        );

        setTimeout(() => {
          this.router.navigate(['/Cuidador/home/welcome']);
        }, 2000); // Espera 2 segundos antes de navegar
      },
      error: (error) => {
        this.loadingService.hide();
        this.showNotification(
          'Error',
          error.error?.error || 'Error al unirse',
          'error'
        );
      },
    });
  }

  crearNuevoCentro() {
    this.router.navigate(['/Auth/centro-gerontologico/crear']);
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
