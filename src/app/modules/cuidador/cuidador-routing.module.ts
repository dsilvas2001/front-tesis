import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { GestionPacientesComponent } from './pages/pacientes/gestion-pacientes/gestion-pacientes.component';
import { LimitesSignosVitalesComponent } from './pages/pacientes/limites-signos-vitales/limites-signos-vitales.component';
import { GestionSignosVitalesComponent } from './pages/pacientes/gestion-signos-vitales/gestion-signos-vitales.component';
import { PacienteResolver } from '../../core/cuidador/resolver/paciente.resolver';
import { ReferenciaSignosVResolver } from '../../core/cuidador/resolver/referencia-signos-v.resolver';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
        resolve: {
          data: PacienteResolver,
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
        // resolve: {
        //   data: DashboardResolver,
        // },
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
