import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent implements OnInit {
  collapseShow = 'hidden';
  activeLink: string = '';
  userEmail: unknown = 'email';
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
      name: 'Gestión de Estudiantes',
      icon: 'fa-solid fa-cubes',

      link: '/Dashboard/dashboard-home/list-user',
    },
    {
      name: 'Cerrar Sesión',
      icon: 'fa-solid fa-arrow-right-from-bracket',
      link: null,
      action: () => this.logout(),
    },
  ];

  ngOnInit() {
    const statuSidebar = localStorage.getItem('activeLink');
    if (!statuSidebar) {
      this.activeLink = 'home';
      localStorage.setItem('activeLink', 'home');
    } else {
      this.activeLink = statuSidebar;
    }
    // this.userEmail = this.authServices.getUserEmail();
    console.log(this.userEmail);
  }
}
