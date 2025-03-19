import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuidadorRoutingModule } from './cuidador-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SharedModule } from '../shared/shared.module';
import { CardsComponent } from './components/cards/cards.component';
import { GestionPacientesComponent } from './pages/pacientes/gestion-pacientes/gestion-pacientes.component';
import { GestionSignosVitalesComponent } from './pages/pacientes/gestion-signos-vitales/gestion-signos-vitales.component';
import { ComponentsModule } from './components/components.module';
import { LimitesSignosVitalesComponent } from './pages/pacientes/limites-signos-vitales/limites-signos-vitales.component';
import { GestionEjerciciosComponent } from './pages/pacientes/gestion-ejercicios/gestion-ejercicios.component';
import { GestionSupervisionComponent } from './pages/pacientes/gestion-supervision/gestion-supervision.component';
import { ModalGenerateEjercicioComponent } from './pages/pacientes/modal-generate-ejercicio/modal-generate-ejercicio.component';
import { WelcomeEjercicioComponent } from './pages/pacientes/ejercicios/welcome-ejercicio/welcome-ejercicio.component';
import { EjercicioComponent } from './pages/pacientes/ejercicios/ejercicio/ejercicio.component';
import { EjercicioMultipleComponent } from './pages/pacientes/ejercicios/ejercicio-multiple/ejercicio-multiple.component';
import { EjercicioResultadosComponent } from './pages/pacientes/ejercicios/ejercicio-resultados/ejercicio-resultados.component';

@NgModule({
  declarations: [
    DashboardComponent,
    WelcomeComponent,
    GestionPacientesComponent,
    GestionSignosVitalesComponent,
    LimitesSignosVitalesComponent,
    GestionEjerciciosComponent,
    GestionSupervisionComponent,
    ModalGenerateEjercicioComponent,
    WelcomeEjercicioComponent,
    EjercicioComponent,
    EjercicioMultipleComponent,
    EjercicioResultadosComponent,
  ],
  imports: [
    CommonModule,
    CuidadorRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
})
export class CuidadorModule {}
