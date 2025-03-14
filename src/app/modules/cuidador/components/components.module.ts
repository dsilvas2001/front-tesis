import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CardsComponent } from './cards/cards.component';
import { RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { ModalPacienteComponent } from './modal-paciente/modal-paciente.component';
import { SharedModule } from '../../shared/shared.module';
import { PaginationComponent } from './pagination/pagination.component';
import { ReferenciasSignosVComponent } from './referencias-signos-v/referencias-signos-v.component';
import { TableReferenciasSignosVComponent } from './table-referencias-signos-v/table-referencias-signos-v.component';
import { ModalReferenciasSignosvComponent } from './modal-referencias-signosv/modal-referencias-signosv.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { CardsSvComponent } from './cards-sv/cards-sv.component';
import { ModalSignosvComponent } from './modal-signosv/modal-signosv.component';
import { CardsPacienteEjercicioComponent } from './cards-paciente-ejercicio/cards-paciente-ejercicio.component';
import { CategoriaEjercicioComponent } from './categoria-ejercicio/categoria-ejercicio.component';
import { ModalMainGenerateComponent } from './modal-main-generate/modal-main-generate.component';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    CardsComponent,
    TableComponent,
    ModalPacienteComponent,
    PaginationComponent,
    ReferenciasSignosVComponent,
    TableReferenciasSignosVComponent,
    ModalReferenciasSignosvComponent,
    DropdownComponent,
    CalendarioComponent,
    CardsSvComponent,
    ModalSignosvComponent,
    CardsPacienteEjercicioComponent,
    CategoriaEjercicioComponent,
    ModalMainGenerateComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [
    SidebarComponent,
    NavbarComponent,
    CardsComponent,
    TableComponent,
    TableReferenciasSignosVComponent,
    CardsSvComponent,
    CardsPacienteEjercicioComponent,
    CalendarioComponent,
    CategoriaEjercicioComponent,
  ],
})
export class ComponentsModule {}
