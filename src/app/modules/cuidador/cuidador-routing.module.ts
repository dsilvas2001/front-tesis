import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { GestionPacientesComponent } from './pages/pacientes/gestion-pacientes/gestion-pacientes.component';
import { DashboardResolver } from './pages/dashboard-resolver';

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      {
        path: 'welcome',
        component: WelcomeComponent,
        resolve: {
          data: DashboardResolver,
        },
      },
      {
        path: 'gestion-pacientes',
        component: GestionPacientesComponent,
        resolve: {
          data: DashboardResolver,
        },
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
