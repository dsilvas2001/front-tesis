import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CardsComponent } from './cards/cards.component';
import { RouterModule } from '@angular/router';
import { TableComponent } from './table/table.component';
import { ModalPacienteComponent } from './modal-paciente/modal-paciente.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    CardsComponent,
    TableComponent,
    ModalPacienteComponent,
  ],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [SidebarComponent, NavbarComponent, CardsComponent, TableComponent],
})
export class ComponentsModule {}
