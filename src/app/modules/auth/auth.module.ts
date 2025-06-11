import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../../core/auth/auth.service';
import { CentroGerontologicoComponent } from './centro-gerontologico/centro-gerontologico.component';
import { SeleccionarComponent } from './centro-gerontologico/seleccionar/seleccionar.component';
import { CrearComponent } from './centro-gerontologico/crear/crear.component';

@NgModule({
  declarations: [SignInComponent, SignUpComponent, CentroGerontologicoComponent, SeleccionarComponent, CrearComponent],
  imports: [CommonModule, AuthRoutingModule, SharedModule],
  providers: [AuthService],
})
export class AuthModule {}
