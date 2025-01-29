import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: ``,
})
export class WelcomeComponent implements OnInit {
  statusnotification: boolean = false;
  notificationTitle: string = '';
  notificationMessage: string = '';
  notificationType: string = '';
  userEmail: unknown = 'email';
  cards = [
    { title: 'Pacientes Agregados', count: 120, icon: 'fa-solid fa-user' },
    {
      title: 'Signos Vitales (Hoy)',
      count: 5,
      icon: 'fa-solid fa-heart-pulse',
    },
    {
      title: 'Ejercicios Generados (Hoy)',
      count: 10,
      icon: 'fa-solid fa-chalkboard-user',
    },
  ];

  constructor(
    private authServices: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data['data'];
    if (localStorage.getItem('prueba') === 'true') {
      // this.userEmail = this.authServices.getUserEmail();

      this.statusnotification = true;
      this.showNotification(
        `Bienvenido, ${this.userEmail}`,
        'Has iniciado sesión correctamente. ¡Nos alegra verte de nuevo!',
        'success'
      );

      localStorage.setItem('prueba', 'false');
    }
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
