import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { GestionPacientesComponent } from './pages/pacientes/gestion-pacientes/gestion-pacientes.component';
import { LimitesSignosVitalesComponent } from './pages/pacientes/limites-signos-vitales/limites-signos-vitales.component';
import { GestionSignosVitalesComponent } from './pages/pacientes/gestion-signos-vitales/gestion-signos-vitales.component';
import { PacienteResolver } from '../../core/cuidador/resolver/paciente.resolver';
import { ReferenciaSignosVResolver } from '../../core/cuidador/resolver/referencia-signos-v.resolver';
import { SignosVResolver } from '../../core/cuidador/resolver/signosv.resolver';
import { GestionEjerciciosComponent } from './pages/pacientes/gestion-ejercicios/gestion-ejercicios.component';
import { GestionSupervisionComponent } from './pages/pacientes/gestion-supervision/gestion-supervision.component';
import { EjercicioPacienteResolver } from '../../core/cuidador/resolver/ejercicio-paciente.resolver';
import { DashboardHomeResolver } from '../../core/cuidador/resolver/dashboard-home.resolver';
import { ModalGenerateEjercicioComponent } from './pages/pacientes/modal-generate-ejercicio/modal-generate-ejercicio.component';
import { ModalMainGenerateComponent } from './components/modal-main-generate/modal-main-generate.component';
import { WelcomeEjercicioComponent } from './pages/pacientes/ejercicios/welcome-ejercicio/welcome-ejercicio.component';
import { EjercicioComponent } from './pages/pacientes/ejercicios/ejercicio/ejercicio.component';
import { EjercicioMultipleComponent } from './pages/pacientes/ejercicios/ejercicio-multiple/ejercicio-multiple.component';
import { EjercicioResultadosComponent } from './pages/pacientes/ejercicios/ejercicio-resultados/ejercicio-resultados.component';
import { GestionCuidadorComponent } from './pages/gestion-cuidador/gestion-cuidador.component';
import { CuidadorResolver } from '../../core/cuidador/resolver/cuidador.resolver';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
        resolve: {
          data: DashboardHomeResolver,
        },
      },
      {
        path: 'cuidador',
        component: GestionCuidadorComponent,
        resolve: {
          data: CuidadorResolver,
        },
      },
      {
        path: 'gestion-pacientes',
        component: GestionPacientesComponent,
        resolve: {
          data: PacienteResolver,
        },
      },
      {
        path: 'signos-vitales-referentes',
        component: LimitesSignosVitalesComponent,
        resolve: {
          data: ReferenciaSignosVResolver,
        },
      },
      {
        path: 'signos-vitales-diarios',
        component: GestionSignosVitalesComponent,
        resolve: {
          data: SignosVResolver,
        },
      },
      {
        path: 'gestion-ejercicios',
        component: GestionEjerciciosComponent,
        resolve: {
          data: EjercicioPacienteResolver,
        },
      },
      {
        path: 'gestion-supervision-ejercicios',
        component: GestionSupervisionComponent,
      },
      { path: '**', redirectTo: 'welcome' },
    ],
  },
  {
    path: 'ejercicios',
    component: EjercicioComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeEjercicioComponent,
      },
      {
        path: 'ejercicio-multiple',
        component: EjercicioMultipleComponent,
      },
      {
        path: 'ejercicio-resultados',
        component: EjercicioResultadosComponent,
      },
      { path: '**', redirectTo: 'welcome' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuidadorRoutingModule {}
