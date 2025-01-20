import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuidadorRoutingModule } from './cuidador-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SidebarComponent,
    NavbarComponent
  ],
  imports: [CommonModule, CuidadorRoutingModule],
})
export class CuidadorModule {}
