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

@NgModule({
  declarations: [
    DashboardComponent,
    WelcomeComponent,
    GestionPacientesComponent,
    GestionSignosVitalesComponent,
    LimitesSignosVitalesComponent,
  ],
  imports: [
    CommonModule,
    CuidadorRoutingModule,
    SharedModule,
    ComponentsModule,
  ],
})
export class CuidadorModule {}
