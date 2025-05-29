import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { DatePipe } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``,
  standalone: false,
})
export class SidebarComponent implements OnInit {
  collapseShow = 'hidden';
  activeLink: string = '';
  userEmail: unknown = 'email';
  tooltipMessage: string = 'Tooltip message';

  constructor(private router: Router, private authServices: AuthService) {}

  setActiveLink(link: string) {
    this.activeLink = link;
    localStorage.setItem('activeLink', link);
  }

  isMenuOpen = false;
  isScrolled = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubMenu(item: any): void {
    if (item.subItems) {
      item.isOpen = !item.isOpen;
    } else {
      this.setActiveLink(item.name);
      this.router.navigate([item.link]);
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  logout() {
    this.router.navigate(['/Auth/login']);
    localStorage.removeItem('activeLink');
  }

  menuItems = [
    {
      name: 'Home',
      icon: 'fa-solid fa-house',
      link: '/Cuidador/home/welcome',
    },
    {
      name: 'Gestión De Pacientes',
      icon: 'fa-solid fa-users',
      link: '/Cuidador/home/gestion-pacientes',
    },
    {
      name: 'Signos Vitales',
      icon: 'fa-solid fa-heartbeat',
      link: null, // No tiene un enlace directo
      subItems: [
        {
          name: 'Signos Vitales Diarios',
          icon: 'fa-solid fa-calendar-day',
          link: '/Cuidador/home/signos-vitales-diarios',
        },
        {
          name: 'Referencias SV',
          icon: 'fa-solid fa-chart-line',
          link: '/Cuidador/home/signos-vitales-referentes',
        },
      ],
      isOpen: false, // Estado para controlar si el submenú está abierto
    },
    {
      name: 'Ejercicios Cognitivos',
      icon: 'fa-solid fa-cubes',
      link: null, // No tiene un enlace directo
      subItems: [
        {
          name: 'Ejercicios Diarios',
          icon: 'fa-solid fa-puzzle-piece',
          link: '/Cuidador/home/gestion-ejercicios',
        },
        // {
        //   name: 'Supervision Ejercicios',
        //   icon: 'fa-solid fa-list-check',
        //   link: '/Cuidador/home/gestion-supervision-ejercicios',
        // },
      ],
      isOpen: false, // Estado para controlar si el submenú está abierto
    },

    {
      name: 'Cerrar Sesión',
      icon: 'fa-solid fa-arrow-right-from-bracket',
      link: null,
      action: () => this.logout(),
    },
  ];

  ngOnInit() {
    this.userEmail = this.authServices.getUserEmail();
    this.initializeConnectionTime();

    // Suscribirse a los cambios de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveLinkBasedOnRoute();
      });

    // Verificar estado inicial
    const statuSidebar = localStorage.getItem('activeLink');
    if (!statuSidebar) {
      this.activeLink = 'Home'; // Debe coincidir exactamente con el name de tu ítem
      localStorage.setItem('activeLink', 'Home');
    } else {
      this.activeLink = statuSidebar;
    }
  }

  private updateActiveLinkBasedOnRoute() {
    const currentRoute = this.router.url;

    // Buscar en los items principales
    for (const item of this.menuItems) {
      if (item.link === currentRoute) {
        this.activeLink = item.name;
        localStorage.setItem('activeLink', item.name);
        return;
      }

      // Buscar en los subItems si existen
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem.link === currentRoute) {
            this.activeLink = subItem.name;
            localStorage.setItem('activeLink', subItem.name);
            return;
          }
        }
      }
    }

    // Si no encuentra coincidencia, establecer 'Home' como predeterminado
    this.activeLink = 'Home';
    localStorage.setItem('activeLink', 'Home');
  }

  private formatDate(date: Date): string {
    return new DatePipe('en-US').transform(date, 'dd/MM/yyyy HH:mm')!;
  }

  initializeConnectionTime() {
    const storedConnection = localStorage.getItem('initialConnectionTime');
    const now = new Date();

    if (!storedConnection) {
      const connectionTime = this.formatDate(now);
      localStorage.setItem('initialConnectionTime', connectionTime);
      this.tooltipMessage = `Conectado desde: ${connectionTime}`;
    } else {
      // Opcional: Verificar si ha pasado mucho tiempo (ej. 24h)
      const connectionDate = new Date(storedConnection);
      const hoursConnected =
        Math.abs(now.getTime() - connectionDate.getTime()) / 36e5;

      if (hoursConnected > 24) {
        localStorage.setItem('initialConnectionTime', this.formatDate(now));
      }

      this.tooltipMessage = `Conectado desde: ${storedConnection}`;
    }
  }
}
